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
 * Syncs the Connect account status to our database using V2 API
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

        // Fetch full account details from V2 API for accurate status
        const response = await fetch(`https://api.stripe.com/v2/core/accounts/${account.id}?include=configuration.merchant&include=requirements`, {
            headers: {
                'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
                'Stripe-Version': '2025-04-30.preview',
            },
        });

        if (!response.ok) {
            console.error(`Failed to fetch V2 account details: ${response.status}`);
            // Fallback to V1 data from webhook event
            return handleV1AccountUpdate(user.id, account);
        }

        const v2Account = await response.json();

        // Determine account status from V2 API
        const hasNoDue = v2Account.requirements?.currently_due?.length === 0;
        const cardPaymentsActive = v2Account.configuration?.merchant?.capabilities?.card_payments?.status === 'active';
        const transfersActive = v2Account.configuration?.merchant?.capabilities?.transfers?.status === 'active';

        let status = 'pending';
        if (hasNoDue && cardPaymentsActive && transfersActive) {
            status = 'active';
        } else if (hasNoDue) {
            status = 'restricted'; // No requirements due but capabilities not fully active
        }

        // Update user record
        await prisma.user.update({
            where: { id: user.id },
            data: {
                stripeOnboardingComplete: hasNoDue,
                stripeAccountStatus: status,
            },
        });

        console.log(`Updated user ${user.id} Connect status: ${status} (V2 API)`);

    } catch (error) {
        console.error('Error updating user from webhook:', error);
        throw error;
    }
}

/**
 * Fallback handler using V1 account data from webhook
 */
async function handleV1AccountUpdate(userId: string, account: Stripe.Account) {
    let status = 'pending';
    if (account.details_submitted && account.charges_enabled && account.payouts_enabled) {
        status = 'active';
    } else if (account.details_submitted) {
        status = 'restricted';
    }

    await prisma.user.update({
        where: { id: userId },
        data: {
            stripeOnboardingComplete: account.details_submitted || false,
            stripeAccountStatus: status,
        },
    });

    console.log(`Updated user ${userId} Connect status: ${status} (V1 fallback)`);
}
