import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@buttergolf/db";
import { stripe } from "@/lib/stripe";

/**
 * Creates a Stripe Embedded Checkout Session for single-product purchase
 * Uses Stripe Connect for marketplace payouts (10% platform fee)
 */
export async function POST(req: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
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

    // Calculate platform fee (10%)
    const productPriceInPence = Math.round(product.price * 100);
    const platformFeePercent = 10;
    const applicationFeeAmount = Math.round(
      productPriceInPence * (platformFeePercent / 100),
    );

    // Build product image URL for Stripe (use first image or placeholder)
    const productImages = product.images[0]?.url
      ? [product.images[0].url]
      : undefined;

    // Get base URL for return URL
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.headers.get("origin") ||
      "http://localhost:3000";

    // Create Stripe Embedded Checkout Session
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",

      // ButterGolf brand customization
      branding_settings: {
        display_name: "ButterGolf",
        font_family: "inter", // Clean sans-serif close to Urbanist
        border_style: "rounded", // Matches our rounded aesthetic
        background_color: "#FFFFFF", // Pure White - clean, professional background
        button_color: "#F45314", // Spiced Clementine - our primary brand color
      },

      // Line items - single product
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: product.title,
              description: product.description.slice(0, 500), // Stripe limits description length
              images: productImages,
              metadata: {
                productId: product.id,
              },
            },
            unit_amount: productPriceInPence,
          },
          quantity: 1,
        },
      ],

      // Shipping address collection (UK only for v1)
      shipping_address_collection: {
        allowed_countries: ["GB"],
      },

      // Shipping options - flat rate for MVP, can integrate ShipEngine later
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 499, // £4.99 standard shipping
              currency: "gbp",
            },
            display_name: "Royal Mail Tracked 48",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 2,
              },
              maximum: {
                unit: "business_day",
                value: 4,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 699, // £6.99 express shipping
              currency: "gbp",
            },
            display_name: "Royal Mail Tracked 24",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 2,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 899, // £8.99 next day
              currency: "gbp",
            },
            display_name: "DPD Next Day",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],

      // Phone number collection for shipping
      phone_number_collection: {
        enabled: true,
      },

      // Stripe Connect - route payment to seller with platform fee
      payment_intent_data: {
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
          destination: seller.stripeConnectId,
        },
        metadata: {
          productId: product.id,
          sellerId: seller.id,
          buyerId: buyer.id,
          platformFeePercent: platformFeePercent.toString(),
        },
      },

      // Session metadata for webhook processing
      metadata: {
        productId: product.id,
        sellerId: seller.id,
        buyerId: buyer.id,
      },

      // Return URL after checkout completes
      return_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,

      // Customer email for receipt
      customer_email: buyer.email,
    });

    return NextResponse.json({
      clientSecret: session.client_secret,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create checkout",
      },
      { status: 500 },
    );
  }
}
