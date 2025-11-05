import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@buttergolf/db';
import Stripe from 'stripe';

/**
 * POST /api/stripe/connect/webhook
 * Handles Stripe Connect webhooks for account updates
 * 
 * Events handled:
 * - account.updated: Syncs onboarding status and account details
 * - account.application.authorized: User granted permission to platform
 * - account.application.deauthorized: User revoked permission
 */
export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = (await headers()).get('stripe-signature');

        if (!signature) {
            return NextResponse.json(
                { error: 'Missing stripe-signature header' },
                { status: 400 }
            );
        }

        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            console.error('STRIPE_WEBHOOK_SECRET not configured');
            return NextResponse.json(
                { error: 'Webhook secret not configured' },
                { status: 500 }
            );
        }

        // Verify webhook signature
        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error('Webhook signature verification failed:', err);
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }

        // Handle the event
        switch (event.type) {
            case 'account.updated': {
                const account = event.data.object as Stripe.Account;
                await handleAccountUpdated(account);
                break;
            }

            case 'account.application.authorized': {
                const data = event.data.object as { account?: string };
                if (data.account) {
                    console.log(`Account authorized: ${data.account}`);
                    const account = await stripe.accounts.retrieve(data.account);
                    await handleAccountUpdated(account);
                }
                break;
            }

            case 'account.application.deauthorized': {
                const data = event.data.object as { account?: string };
                if (data.account) {
                    console.log(`Account deauthorized: ${data.account}`);

                    // Find user and clear their Connect account
                    const user = await prisma.user.findUnique({
                        where: { stripeConnectId: data.account },
                    });

                    if (user) {
                        await prisma.user.update({
                            where: { id: user.id },
                            data: {
                                stripeConnectId: null,
                                stripeOnboardingComplete: false,
                                stripeAccountStatus: 'deauthorized',
                            },
                        });
                    }
                }
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json(
            {
                error: 'Webhook processing failed',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

/**
 * Handle account.updated events
 * Syncs the Connect account status to our database
 */
async function handleAccountUpdated(account: Stripe.Account) {
    try {
        // Find user by Connect account ID
        const user = await prisma.user.findUnique({
            where: { stripeConnectId: account.id },
        });

        if (!user) {
            console.warn(`User not found for Stripe account: ${account.id}`);
            return;
        }

        // Determine account status
        let status = 'pending';
        if (account.details_submitted && account.charges_enabled && account.payouts_enabled) {
            status = 'active';
        } else if (account.details_submitted) {
            status = 'restricted'; // Submitted but not fully enabled
        }

        // Update user record
        await prisma.user.update({
            where: { id: user.id },
            data: {
                stripeOnboardingComplete: account.details_submitted || false,
                stripeAccountStatus: status,
            },
        });

        console.log(`Updated user ${user.id} Connect status: ${status}`);

    } catch (error) {
        console.error('Error updating user from webhook:', error);
        throw error;
    }
}
