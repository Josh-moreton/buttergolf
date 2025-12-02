import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@buttergolf/db";
import { stripe } from "@/lib/stripe";
import { getOrCreateUser } from "@/lib/auth-helpers";

export async function POST(request: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user exists in database
    const user = await getOrCreateUser(userId);

    const body = await request.json();
    const { productId, shippingAddress, selectedRateId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 },
      );
    }

    // Fetch product with seller information
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        user: {
          include: {
            addresses: {
              where: { isDefault: true },
              take: 1,
            },
          },
        },
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

    // Verify seller has completed Stripe Connect onboarding
    if (!product.user.stripeConnectId) {
      return NextResponse.json(
        { error: "Seller has not set up payments yet" },
        { status: 400 },
      );
    }

    if (!product.user.stripeOnboardingComplete) {
      return NextResponse.json(
        { error: "Seller has not completed onboarding" },
        { status: 400 },
      );
    }

    // Verify seller has a shipping address
    if (!product.user.addresses.length) {
      return NextResponse.json(
        { error: "Seller has no shipping address configured" },
        { status: 400 },
      );
    }

    // Calculate shipping rates if not provided
    let shippingAmount = 999; // Fallback to $9.99
    const selectedRate = null;

    if (selectedRateId) {
      // If a specific rate was selected, recalculate using the service directly
      try {
        const { calculateShippingRates } = await import("@/lib/shipping");
        const shippingData = await calculateShippingRates({
          productId,
          toAddress: shippingAddress,
        });

        const selectedRate = shippingData.rates?.find(
          (rate) => rate.id === selectedRateId,
        );
        if (selectedRate) {
          shippingAmount = parseInt(selectedRate.rate);
        }
      } catch (error) {
        console.warn("Failed to calculate shipping, using fallback:", error);
      }
    }

    // Calculate amounts
    const productAmount = Math.round(product.price * 100); // Convert to cents
    const totalAmount = productAmount + shippingAmount;

    // Calculate platform fee (10%)
    const platformFeeAmount = Math.round(totalAmount * 0.1);

    // Create PaymentIntent with Connect routing
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      // Route payment to seller's Connect account
      on_behalf_of: product.user.stripeConnectId,
      transfer_data: {
        destination: product.user.stripeConnectId,
      },
      // Platform fee (10% of total)
      application_fee_amount: platformFeeAmount,
      // Metadata for webhook processing
      metadata: {
        productId: product.id,
        sellerId: product.userId,
        buyerId: user.id,
        productAmount: productAmount.toString(),
        shippingAmount: shippingAmount.toString(),
        platformFee: platformFeeAmount.toString(),
        // Store shipping address for order creation
        shippingAddressJSON: JSON.stringify(shippingAddress),
        selectedRateId: selectedRateId || "",
        selectedRateJSON: selectedRate ? JSON.stringify(selectedRate) : "",
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalAmount,
      shippingAmount,
      product: {
        id: product.id,
        title: product.title,
        price: product.price,
        imageUrl: product.images[0]?.url || null,
      },
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 },
    );
  }
}
