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

        // 3. Create Stripe Connect account if it doesn't exist (using Accounts V2 API)
        if (!stripeAccountId) {
            // Use Stripe V2 API to create account with merchant configuration
            const response = await fetch('https://api.stripe.com/v2/core/accounts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                    'Stripe-Version': '2025-04-30.preview',
                },
                body: JSON.stringify({
                    contact_email: user.email,
                    display_name: user.name || 'ButterGolf Seller',
                    dashboard: 'express', // Express dashboard for simplified onboarding
                    identity: {
                        country: 'US', // Default to US, user can change during onboarding
                    },
                    configuration: {
                        merchant: {
                            capabilities: {
                                card_payments: { requested: true },
                                transfers: { requested: true },
                            },
                        },
                    },
                    defaults: {
                        currency: 'usd',
                        responsibilities: {
                            fees_collector: 'stripe',
                            losses_collector: 'stripe',
                        },
                        locales: ['en-US'],
                    },
                    metadata: {
                        userId: user.id,
                        clerkId: userId,
                    },
                    include: [
                        'configuration.merchant',
                        'identity',
                        'requirements',
                    ],
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Stripe V2 API error: ${JSON.stringify(error)}`);
            }

            const account = await response.json();
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

        // If user has Connect account, fetch latest status from Stripe V2 API
        if (user.stripeConnectId) {
            const response = await fetch(`https://api.stripe.com/v2/core/accounts/${user.stripeConnectId}?include=configuration.merchant&include=identity&include=requirements`, {
                headers: {
                    'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
                    'Stripe-Version': '2025-04-30.preview',
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Stripe V2 API error: ${JSON.stringify(error)}`);
            }

            const account = await response.json();

            return NextResponse.json({
                hasAccount: true,
                accountId: user.stripeConnectId,
                onboardingComplete: account.requirements?.currently_due?.length === 0,
                chargesEnabled: account.configuration?.merchant?.capabilities?.card_payments?.status === 'active',
                payoutsEnabled: account.configuration?.merchant?.capabilities?.transfers?.status === 'active',
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
