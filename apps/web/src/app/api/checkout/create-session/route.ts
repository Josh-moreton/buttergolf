import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@buttergolf/db";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    // 1. Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get buyer from database
    const buyer = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!buyer) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Parse request
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // 4. Get product details
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { user: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.isSold) {
      return NextResponse.json(
        { error: "Product already sold" },
        { status: 400 }
      );
    }

    // 5. Calculate shipping (fixed rate for now - can be enhanced with EasyPost estimates)
    const FIXED_SHIPPING = 9.99; // USD

    // 6. Create Stripe session
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const session = await createCheckoutSession({
      productId: product.id,
      productTitle: product.title,
      productPrice: product.price,
      shippingCost: FIXED_SHIPPING,
      sellerId: product.userId,
      buyerId: buyer.id,
      successUrl: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/products/${product.id}`,
    });

    // 7. Return session URL
    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Checkout session creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
