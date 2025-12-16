import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@buttergolf/db";
import { stripe } from "@/lib/stripe";

// Disable body parsing for webhook
export const runtime = "nodejs";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Missing webhook secret" },
      { status: 500 },
    );
  }

  try {
    const body = await req.text();
    const headerPayload = await headers();
    const signature = headerPayload.get("stripe-signature");

    if (!signature) {
      console.error("Missing stripe-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        {
          error: `Webhook signature verification failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        },
        { status: 400 },
      );
    }

    console.log("Stripe webhook event received:", event.type);

    // Handle checkout.session.completed event (primary event for Embedded Checkout)
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("Checkout session completed:", {
        id: session.id,
        paymentIntentId: session.payment_intent,
        amountTotal: session.amount_total,
        metadata: session.metadata,
      });

      // Extract metadata
      const { productId, sellerId, buyerId } = session.metadata || {};

      if (!productId || !sellerId || !buyerId) {
        console.error("Missing required metadata in checkout session:", session.metadata);
        return NextResponse.json(
          { error: "Missing metadata" },
          { status: 400 },
        );
      }

      // Get payment intent ID
      const paymentIntentId = typeof session.payment_intent === "string" 
        ? session.payment_intent 
        : session.payment_intent?.id;

      if (!paymentIntentId) {
        console.error("Missing payment intent ID in session");
        return NextResponse.json(
          { error: "Missing payment intent" },
          { status: 400 },
        );
      }

      // Idempotency check - don't process twice
      const existingOrder = await prisma.order.findFirst({
        where: {
          OR: [
            { stripePaymentId: paymentIntentId },
            { stripeCheckoutId: session.id },
          ],
        },
      });

      if (existingOrder) {
        console.log("Order already exists for session:", session.id);
        return NextResponse.json({
          received: true,
          orderId: existingOrder.id,
          message: "Order already processed",
        });
      }

      // Get product details
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
        },
      });

      if (!product) {
        console.error("Product not found:", productId);
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 },
        );
      }

      // Get buyer information
      const buyer = await prisma.user.findUnique({
        where: { id: buyerId },
      });

      if (!buyer) {
        console.error("Buyer not found:", buyerId);
        return NextResponse.json({ error: "Buyer not found" }, { status: 404 });
      }

      // Get shipping details from the session
      // Note: shipping_details is available on the Session object for payment mode
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const shippingDetails = (session as any).shipping_details as {
        address?: {
          line1?: string;
          line2?: string;
          city?: string;
          state?: string;
          postal_code?: string;
          country?: string;
        };
        name?: string;
      } | undefined;
      const customerDetails = session.customer_details;

      if (!shippingDetails?.address) {
        console.error("Missing shipping details in session");
        return NextResponse.json(
          { error: "Missing shipping details" },
          { status: 400 },
        );
      }

      // Create buyer's shipping address (To Address)
      const toAddress = await prisma.address.create({
        data: {
          userId: buyerId,
          name: shippingDetails.name || `${buyer.firstName} ${buyer.lastName}`.trim() || buyer.email,
          street1: shippingDetails.address.line1 || "",
          street2: shippingDetails.address.line2 || undefined,
          city: shippingDetails.address.city || "",
          state: shippingDetails.address.state || "",
          zip: shippingDetails.address.postal_code || "",
          country: shippingDetails.address.country || "GB",
          phone: customerDetails?.phone || undefined,
        },
      });

      // Get seller's default address (From Address)
      // If seller has no address, create a placeholder that they need to update
      let fromAddress = product.user.addresses[0];
      if (!fromAddress) {
        // Create placeholder address - seller will need to update before shipping
        fromAddress = await prisma.address.create({
          data: {
            userId: sellerId,
            name: `${product.user.firstName} ${product.user.lastName}`.trim() || product.user.email,
            street1: "Address pending",
            city: "Pending",
            state: "",
            zip: "XX00 0XX",
            country: "GB",
            isDefault: true,
          },
        });
        console.warn("Seller has no address, created placeholder:", fromAddress.id);
      }

      // Calculate amounts from session
      const amountTotal = (session.amount_total || 0) / 100; // Convert from pence
      const shippingCost = (session.shipping_cost?.amount_total || 0) / 100;
      
      // Get platform fee from payment intent metadata or calculate
      const platformFeePercent = 10;
      const subtotal = (session.amount_subtotal || 0) / 100;
      const platformFeeAmount = subtotal * (platformFeePercent / 100);
      const sellerPayout = amountTotal - platformFeeAmount;

      // Create the order
      const order = await prisma.order.create({
        data: {
          stripePaymentId: paymentIntentId,
          stripeCheckoutId: session.id,
          amountTotal,
          shippingCost,
          stripePlatformFee: platformFeeAmount,
          stripeSellerPayout: sellerPayout,
          stripePayoutStatus: "pending",
          sellerId,
          buyerId,
          productId,
          fromAddressId: fromAddress.id,
          toAddressId: toAddress.id,
          // Shipping label will be generated separately or by seller
          shipmentStatus: "PENDING",
          status: "PAYMENT_CONFIRMED",
        },
      });

      // Mark product as sold
      await prisma.product.update({
        where: { id: productId },
        data: { isSold: true },
      });

      console.log("Order created successfully:", order.id);

      // TODO: Send notification emails to buyer and seller
      // TODO: Generate shipping label via ShipEngine when seller confirms

      return NextResponse.json({
        received: true,
        orderId: order.id,
      });
    }

    // Handle other event types if needed (keep for backwards compatibility during transition)
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      // Check if this was already handled by checkout.session.completed
      const existingOrder = await prisma.order.findFirst({
        where: { stripePaymentId: paymentIntent.id },
      });

      if (existingOrder) {
        console.log("Order already exists for payment intent (handled by session):", paymentIntent.id);
        return NextResponse.json({
          received: true,
          orderId: existingOrder.id,
          message: "Order already processed via checkout session",
        });
      }

      // This payment intent wasn't from an embedded checkout session
      // Log it but don't process - embedded checkout should handle everything
      console.log("Received payment_intent.succeeded without matching order:", paymentIntent.id);
      console.log("This may be from a legacy flow or direct API call");
    }

    // Handle other event types if needed
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
