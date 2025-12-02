import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@buttergolf/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ paymentIntentId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paymentIntentId } = await params;

    // Find order by payment intent ID
    const order = await prisma.order.findFirst({
      where: {
        stripePaymentId: paymentIntentId,
      },
      include: {
        product: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify user owns this order (either buyer or seller)
    if (order.buyerId !== userId && order.sellerId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

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
      { error: "Failed to fetch order" },
      { status: 500 },
    );
  }
}
