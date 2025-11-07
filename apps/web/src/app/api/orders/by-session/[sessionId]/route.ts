import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@buttergolf/db";
import { getOrCreateUser } from "@/lib/auth-helpers";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await params;

    // Get or create buyer (webhook primary, API fallback)
    const buyer = await getOrCreateUser(userId);

    // Find order by checkout session ID
    const order = await prisma.order.findFirst({
      where: {
        stripeCheckoutId: sessionId,
        buyerId: buyer.id, // Ensure it belongs to the authenticated user
      },
      include: {
        product: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Return simplified order details
    return NextResponse.json({
      id: order.id,
      productTitle: order.product.title,
      amountTotal: order.amountTotal,
      trackingCode: order.trackingCode,
      carrier: order.carrier,
      status: order.status,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
