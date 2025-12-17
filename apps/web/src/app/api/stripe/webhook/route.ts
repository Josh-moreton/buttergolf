import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@buttergolf/db";
import { stripe } from "@/lib/stripe";
import { sendOrderConfirmationEmail, sendNewSaleEmail } from "@/lib/email";

// Disable body parsing for webhook
export const runtime = "nodejs";

/**
 * POST /api/stripe/webhook
 * 
 * Handles Stripe webhooks for the checkout/payment flow.
 * This is SEPARATE from the Connect webhook (/api/stripe/connect/webhook).
 * 
 * Events handled:
 * - checkout.session.completed: Primary event - creates order, sends emails
 * - checkout.session.expired: Logs expired checkouts (inventory release if needed)
 * - payment_intent.succeeded: Fallback for non-checkout payments
 * - payment_intent.payment_failed: Log payment failures
 * - charge.refunded: Handle refunds, restore product availability
 * - charge.dispute.created: Alert on chargebacks
 * - charge.dispute.closed: Track dispute resolution
 */
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

    console.log("🔔 Stripe webhook event received:", event.type);

    // Handle events with switch for cleaner organization
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        return await handleCheckoutCompleted(session);
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        handleCheckoutExpired(session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        handlePaymentFailed(paymentIntent);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        await handleRefund(charge);
        break;
      }

      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute;
        handleDisputeCreated(dispute);
        break;
      }

      case "charge.dispute.closed": {
        const dispute = event.data.object as Stripe.Dispute;
        handleDisputeClosed(dispute);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

// ============================================================================
// CHECKOUT SESSION HANDLERS
// ============================================================================

/**
 * Handle checkout.session.completed event (primary event for Embedded Checkout)
 * Creates order, sends confirmation emails to buyer and seller
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("✅ Checkout session completed:", {
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
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
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
  // Note: Stripe API 2025-11-17+ puts shipping under collected_information.shipping_details
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionAny = session as any;
  const shippingDetails = (
    sessionAny.collected_information?.shipping_details ||  // New API location
    sessionAny.shipping_details                            // Legacy fallback
  ) as {
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
    console.error("Missing shipping details in session. Available fields:", {
      hasCollectedInfo: !!sessionAny.collected_information,
      hasShippingDetails: !!sessionAny.shipping_details,
      collectedInfoKeys: Object.keys(sessionAny.collected_information || {}),
    });
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
  
  // Calculate platform fee (10%)
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
      shipmentStatus: "PENDING",
      status: "PAYMENT_CONFIRMED",
    },
  });

  // Mark product as sold
  await prisma.product.update({
    where: { id: productId },
    data: { isSold: true },
  });

  console.log("📦 Order created successfully:", order.id);

  // Send notification emails
  await sendOrderEmails(order.id, amountTotal, buyer, product, shippingDetails, sellerPayout);

  return NextResponse.json({
    received: true,
    orderId: order.id,
  });
}

/**
 * Send confirmation emails to buyer and notification to seller
 */
async function sendOrderEmails(
  orderId: string,
  amountTotal: number,
  buyer: { email: string; firstName: string | null; lastName: string | null },
  product: { 
    title: string; 
    user: { email: string; firstName: string | null; lastName: string | null };
    images?: { url: string }[];
  },
  shippingDetails: { address?: { city?: string; postal_code?: string } },
  sellerPayout: number,
) {
  const buyerName = `${buyer.firstName} ${buyer.lastName}`.trim() || buyer.email;
  const sellerName = `${product.user.firstName} ${product.user.lastName}`.trim() || product.user.email;

  console.log("📧 Sending order notification emails...", {
    orderId,
    buyerEmail: buyer.email,
    sellerEmail: product.user.email,
    hasResendApiKey: !!process.env.RESEND_API_KEY,
  });

  // Send order confirmation to buyer
  const buyerEmailResult = await sendOrderConfirmationEmail({
    buyerEmail: buyer.email,
    buyerName,
    orderId,
    productTitle: product.title,
    productImage: product.images?.[0]?.url,
    amountTotal,
    sellerName,
  });

  if (buyerEmailResult.success) {
    console.log("✅ Buyer confirmation email sent:", {
      orderId,
      emailId: buyerEmailResult.id,
      recipient: buyer.email,
    });
  } else {
    console.error("❌ Failed to send buyer confirmation email:", {
      orderId,
      recipient: buyer.email,
      error: buyerEmailResult.error,
    });
  }

  // Send new sale notification to seller
  const sellerEmailResult = await sendNewSaleEmail({
    sellerEmail: product.user.email,
    sellerName,
    orderId,
    productTitle: product.title,
    buyerName,
    amountTotal,
    sellerPayout,
    shippingAddress: {
      city: shippingDetails.address?.city || "",
      zip: shippingDetails.address?.postal_code || "",
    },
  });

  if (sellerEmailResult.success) {
    console.log("✅ Seller notification email sent:", {
      orderId,
      emailId: sellerEmailResult.id,
      recipient: product.user.email,
    });
  } else {
    console.error("❌ Failed to send seller notification email:", {
      orderId,
      recipient: product.user.email,
      error: sellerEmailResult.error,
    });
  }
}

/**
 * Handle checkout.session.expired
 * Currently just logs - can release reserved inventory if implementing hold system
 */
function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const { productId } = session.metadata || {};
  
  console.log("⏰ Checkout session expired:", {
    sessionId: session.id,
    productId: productId || "none",
  });

  // If we implement inventory hold during checkout, release it here
  // Currently products aren't reserved until checkout completes
}

// ============================================================================
// PAYMENT INTENT HANDLERS
// ============================================================================

/**
 * Handle payment_intent.succeeded
 * Fallback for direct API payments (non-checkout)
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Check if this was already handled by checkout.session.completed
  const existingOrder = await prisma.order.findFirst({
    where: { stripePaymentId: paymentIntent.id },
  });

  if (existingOrder) {
    console.log("💰 Payment intent succeeded (already handled by checkout):", paymentIntent.id);
    return;
  }

  // Payment intent without matching order - likely from legacy flow or direct API
  console.log("💰 Payment intent succeeded without checkout session:", {
    id: paymentIntent.id,
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency,
    metadata: paymentIntent.metadata,
  });
  
  // Could implement direct payment handling here if needed
}

/**
 * Handle payment_intent.payment_failed
 * Log failed payment attempts for monitoring
 */
function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.error("❌ Payment failed:", {
    id: paymentIntent.id,
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency,
    lastError: paymentIntent.last_payment_error?.message,
    metadata: paymentIntent.metadata,
  });

  // Could notify buyer/seller or implement retry logic here
}

// ============================================================================
// REFUND & DISPUTE HANDLERS
// ============================================================================

/**
 * Handle charge.refunded
 * Update order status and optionally restore product availability
 */
async function handleRefund(charge: Stripe.Charge) {
  console.log("💸 Charge refunded:", {
    chargeId: charge.id,
    paymentIntentId: charge.payment_intent,
    amountRefunded: (charge.amount_refunded || 0) / 100,
    currency: charge.currency,
    refunded: charge.refunded,
  });

  // Find the order by payment intent
  const paymentIntentId = typeof charge.payment_intent === "string" 
    ? charge.payment_intent 
    : charge.payment_intent?.id;

  if (!paymentIntentId) {
    console.warn("No payment intent ID on refunded charge");
    return;
  }

  const order = await prisma.order.findFirst({
    where: { stripePaymentId: paymentIntentId },
    include: { product: true },
  });

  if (!order) {
    console.warn("Order not found for refunded charge:", paymentIntentId);
    return;
  }

  // Update order status (REFUNDED for full refund, keep current for partial)
  if (charge.refunded) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "REFUNDED" },
    });
  } else {
    // Partial refund - log but don't change status (could add PARTIALLY_REFUNDED to enum later)
    console.log("Partial refund processed for order:", order.id);
  }

  // If fully refunded, restore product availability
  if (charge.refunded) {
    await prisma.product.update({
      where: { id: order.productId },
      data: { isSold: false },
    });
    console.log("📦 Product restored to available:", order.productId);
  }

  // TODO: Send refund confirmation email to buyer
  // TODO: Notify seller of refund
}

/**
 * Handle charge.dispute.created
 * Alert on chargebacks - critical for marketplace operations
 */
function handleDisputeCreated(dispute: Stripe.Dispute) {
  console.error("⚠️ DISPUTE CREATED:", {
    disputeId: dispute.id,
    chargeId: dispute.charge,
    amount: dispute.amount / 100,
    currency: dispute.currency,
    reason: dispute.reason,
    status: dispute.status,
  });

  // TODO: Notify platform admin
  // TODO: Hold seller payout if not already done
  // TODO: Send dispute notification to seller
}

/**
 * Handle charge.dispute.closed
 * Track dispute resolution outcome
 */
function handleDisputeClosed(dispute: Stripe.Dispute) {
  console.log("📋 Dispute closed:", {
    disputeId: dispute.id,
    chargeId: dispute.charge,
    status: dispute.status, // won, lost, warning_closed, etc.
    amount: dispute.amount / 100,
  });

  // TODO: If lost, update order status
  // TODO: If won, release any held seller payouts
  // TODO: Notify seller of outcome
}
