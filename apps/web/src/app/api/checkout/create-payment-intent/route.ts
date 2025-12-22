import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@buttergolf/db";
import { stripe } from "@/lib/stripe";

// Shipping options with prices in pence
const SHIPPING_OPTIONS = {
  standard: { name: "Royal Mail Tracked 48", price: 499 },
  express: { name: "Royal Mail Tracked 24", price: 699 },
  nextDay: { name: "DPD Next Day", price: 899 },
} as const;

type ShippingOptionId = keyof typeof SHIPPING_OPTIONS;

/**
 * Creates a Stripe Payment Intent for single-product purchase
 * Uses Stripe Connect for marketplace payouts (10% platform fee)
 * 
 * This is used by PaymentElement flow (BuyNowSheet)
 * For EmbeddedCheckout, see create-checkout-session/route.ts
 */
export async function POST(req: Request) {
  console.log("[PaymentIntent API] POST request received");

  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      console.log("[PaymentIntent API] ERROR: No clerkUserId - returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, shippingOptionId } = body as {
      productId: string;
      shippingOptionId: ShippingOptionId;
    };

    console.log("[PaymentIntent API] productId:", productId, "shippingOptionId:", shippingOptionId);

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    if (!shippingOptionId || !SHIPPING_OPTIONS[shippingOptionId]) {
      return NextResponse.json(
        { error: "Valid shipping option is required" },
        { status: 400 },
      );
    }

    // Get buyer from Clerk ID
    const buyer = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!buyer) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get product with seller information
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        user: true,
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1,
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.isSold) {
      return NextResponse.json(
        { error: "Product is already sold" },
        { status: 400 },
      );
    }

    // Prevent buying your own product
    if (product.userId === buyer.id) {
      return NextResponse.json(
        { error: "Cannot purchase your own product" },
        { status: 400 },
      );
    }

    // Get seller's Stripe Connect account
    const seller = product.user;
    if (!seller.stripeConnectId || !seller.stripeOnboardingComplete) {
      return NextResponse.json(
        { error: "Seller is not set up to receive payments" },
        { status: 400 },
      );
    }

    // Calculate amounts
    const productPriceInPence = Math.round(product.price * 100);
    const shippingAmount = SHIPPING_OPTIONS[shippingOptionId].price;
    const totalAmount = productPriceInPence + shippingAmount;
    
    // Platform fee (10% of product price only, not shipping)
    const platformFeePercent = 10;
    const applicationFeeAmount = Math.round(
      productPriceInPence * (platformFeePercent / 100),
    );

    console.log("[PaymentIntent API] Amounts:", {
      productPriceInPence,
      shippingAmount,
      totalAmount,
      applicationFeeAmount,
    });

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "gbp",
      automatic_payment_methods: { enabled: true },
      application_fee_amount: applicationFeeAmount,
      transfer_data: {
        destination: seller.stripeConnectId,
      },
      metadata: {
        productId: product.id,
        sellerId: seller.id,
        buyerId: buyer.id,
        shippingOptionId,
        shippingOptionName: SHIPPING_OPTIONS[shippingOptionId].name,
        shippingAmount: shippingAmount.toString(),
        platformFeePercent: platformFeePercent.toString(),
        source: "payment_element", // Distinguish from checkout session flow
      },
      receipt_email: buyer.email,
    });

    console.log("[PaymentIntent API] SUCCESS - PaymentIntent created:", paymentIntent.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      totalAmount,
      shippingAmount,
      productPriceInPence,
    });
  } catch (error) {
    console.error("[PaymentIntent API] FATAL ERROR:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create payment intent",
      },
      { status: 500 },
    );
  }
}
