import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@buttergolf/db';

/**
 * POST /api/stripe/connect/account
 * Creates or retrieves a Stripe Connect Express account for the authenticated user
 * Returns an account session client_secret for embedded onboarding
 */
export async function POST(req: Request) {
    try {
        // 1. Authenticate user
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // 2. Get user from database
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        let stripeAccountId = user.stripeConnectId;

        // 3. Create Stripe Connect account if it doesn't exist
        if (!stripeAccountId) {
            const account = await stripe.accounts.create({
                type: 'express',
                country: 'US', // Default to US, can be made dynamic
                email: user.email,
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
                business_type: 'individual', // Start with individual, user can change during onboarding
                metadata: {
                    userId: user.id,
                    clerkId: userId,
                },
            });

            stripeAccountId = account.id;

            // Save to database
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    stripeConnectId: stripeAccountId,
                },
            });
        }

        // 4. Create AccountSession for embedded onboarding
        // AccountSession provides a client_secret for the frontend embedded component
        const accountSession = await stripe.accountSessions.create({
            account: stripeAccountId,
            components: {
                account_onboarding: { enabled: true },
            },
        });

        // 5. Return the client secret for the embedded component
        return NextResponse.json({
            clientSecret: accountSession.client_secret,
            accountId: stripeAccountId,
        });

    } catch (error) {
        console.error('Error creating Stripe Connect account:', error);

        return NextResponse.json(
            {
                error: 'Failed to create Connect account',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/stripe/connect/account
 * Returns the current user's Connect account status
 */
export async function GET(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: {
                stripeConnectId: true,
                stripeOnboardingComplete: true,
                stripeAccountStatus: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // If user has Connect account, fetch latest status from Stripe
        if (user.stripeConnectId) {
            const account = await stripe.accounts.retrieve(user.stripeConnectId);

            return NextResponse.json({
                hasAccount: true,
                accountId: user.stripeConnectId,
                onboardingComplete: account.details_submitted,
                chargesEnabled: account.charges_enabled,
                payoutsEnabled: account.payouts_enabled,
                requirements: account.requirements,
            });
        }

        return NextResponse.json({
            hasAccount: false,
        });

    } catch (error) {
        console.error('Error fetching Connect account status:', error);

        return NextResponse.json(
            {
                error: 'Failed to fetch account status',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
