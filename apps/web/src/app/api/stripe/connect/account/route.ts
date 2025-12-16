import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@buttergolf/db";

/**
 * POST /api/stripe/connect/account
 * Creates or retrieves a Stripe Connect account for the authenticated user
 * Returns an account session client_secret for embedded onboarding
 *
 * Uses V1 API with controller settings for fully embedded experience:
 * - controller.stripe_dashboard.type = "none" (no Stripe Dashboard access)
 * - Stripe manages risk and compliance
 * - All account management through embedded components
 */
export async function POST() {
  try {
    // 1. Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let stripeAccountId = user.stripeConnectId;

    // 3. Create Stripe Connect account if it doesn't exist (using V1 API)
    if (!stripeAccountId) {
      // Use controller settings for fully embedded experience
      // Note: Do NOT use `type` when using `controller` - they are mutually exclusive
      const account = await stripe.accounts.create({
        country: "GB",
        email: user.email || undefined,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        controller: {
          // Fully embedded - no Stripe Dashboard access for connected accounts
          stripe_dashboard: {
            type: "none",
          },
          // Platform controls requirement collection via embedded components
          requirement_collection: "application",
          // Platform is liable for negative balances (chargebacks, fraud)
          // Required when requirement_collection is "application"
          losses: {
            payments: "application",
          },
          // Platform pays Stripe fees and charges sellers via application_fee
          // Required when requirement_collection is "application"
          fees: {
            payer: "application",
          },
        },
        business_type: "individual",
        // Pre-populate individual details from our database
        individual: {
          first_name: user.firstName || undefined,
          last_name: user.lastName || undefined,
          email: user.email || undefined,
        },
        business_profile: {
          mcc: "5941", // Sporting goods
          product_description: "Golf equipment marketplace seller",
        },
        settings: {
          payouts: {
            schedule: {
              interval: "daily",
            },
          },
        },
        metadata: {
          userId: user.id,
          clerkId: userId,
        },
      });

      stripeAccountId = account.id;
      console.log(`[Stripe Connect] Created new account ${stripeAccountId} for user ${user.id}`);

      // Save to database IMMEDIATELY - so we can clean up even if onboarding is abandoned
      await prisma.user.update({
        where: { id: user.id },
        data: {
          stripeConnectId: stripeAccountId,
          stripeAccountType: "fully_embedded",
        },
      });
      console.log(`[Stripe Connect] Saved stripeConnectId to database for user ${user.id}`);
    }

    // 4. Create AccountSession for embedded onboarding
    // AccountSession provides a client_secret for the frontend embedded component
    const accountSession = await stripe.accountSessions.create({
      account: stripeAccountId,
      components: {
        account_onboarding: {
          enabled: true,
          features: {
            // Enable external account collection for payouts
            external_account_collection: true,
            // Disable Stripe user authentication - keeps everything inline/embedded
            // This is allowed because controller.requirement_collection = "application"
            disable_stripe_user_authentication: true,
          },
        },
      },
    });

    // 5. Return the client secret for the embedded component
    return NextResponse.json({
      clientSecret: accountSession.client_secret,
      accountId: stripeAccountId,
    });
  } catch (error) {
    console.error("Error creating Stripe Connect account:", error);

    return NextResponse.json(
      {
        error: "Failed to create Connect account",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/stripe/connect/account
 * Returns the current user's Connect account status
 */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
    console.error("Error fetching Connect account status:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch account status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
