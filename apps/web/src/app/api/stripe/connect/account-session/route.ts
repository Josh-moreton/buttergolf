import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@buttergolf/db';

/**
 * POST /api/stripe/connect/account-session
 * Creates a new AccountSession for the embedded Connect component
 *
 * AccountSessions are short-lived (expires in ~1 hour) and provide
 * access to embedded Connect components like account onboarding.
 *
 * The frontend should call this endpoint to get a fresh client_secret
 * when initializing the embedded component.
 */
export async function POST() {
    try {
        // 1. Authenticate user
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // 2. Get user's Connect account ID
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { stripeConnectId: true },
        });

        if (!user?.stripeConnectId) {
            return NextResponse.json(
                { error: 'No Connect account found. Create an account first.' },
                { status: 400 }
            );
        }

        // 3. Create AccountSession with embedded onboarding component enabled
        const accountSession = await stripe.accountSessions.create({
            account: user.stripeConnectId,
            components: {
                account_onboarding: { enabled: true },
            },
        });

        // 4. Return client secret for embedded component
        return NextResponse.json({
            clientSecret: accountSession.client_secret,
            accountId: user.stripeConnectId,
        });

    } catch (error) {
        console.error('Error creating AccountSession:', error);

        return NextResponse.json(
            {
                error: 'Failed to create AccountSession',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
