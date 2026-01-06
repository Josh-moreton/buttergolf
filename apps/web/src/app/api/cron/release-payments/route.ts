import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@buttergolf/db";
import { stripe } from "@/lib/stripe";
import { sendPaymentReleasedEmail } from "@/lib/email";

// Vercel Cron configuration
// Schedule: Run daily at 3:00 AM UTC
// Add to vercel.json:
// {
//   "crons": [{
//     "path": "/api/cron/release-payments",
//     "schedule": "0 3 * * *"
//   }]
// }

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes max for processing

/**
 * GET /api/cron/release-payments
 *
 * Auto-release held payments after 14 days from delivery.
 *
 * This is part of the Vinted-style buyer protection flow:
 * 1. Payment is held when order is placed
 * 2. Buyer can manually confirm receipt to release payment
 * 3. If buyer doesn't confirm, payment auto-releases 14 days after delivery
 *
 * Security: Protected by CRON_SECRET environment variable
 */
export async function GET(request: NextRequest) {
  // Verify cron secret for security (MANDATORY)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("CRON_SECRET not configured - refusing to process payments");
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    console.error("Unauthorized cron request - invalid or missing secret");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("Starting auto-release payment cron job...");

  try {
    // Find orders eligible for auto-release:
    // - Payment status is HELD
    // - Auto-release date has passed
    // - Shipment status is DELIVERED (we only auto-release after confirmed delivery)
    const ordersToRelease = await prisma.order.findMany({
      where: {
        paymentHoldStatus: "HELD",
        autoReleaseAt: { lte: new Date() },
        shipmentStatus: "DELIVERED",
      },
      include: {
        seller: true,
        product: true,
      },
    });

    console.log(`Found ${ordersToRelease.length} orders eligible for auto-release`);

    if (ordersToRelease.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No orders eligible for auto-release",
        processed: 0,
        results: [],
      });
    }

    const results: Array<{
      orderId: string;
      status: "success" | "failed";
      transferId?: string;
      error?: string;
    }> = [];

    // Process each order with optimistic locking to prevent duplicate transfers
    for (const order of ordersToRelease) {
      try {
        // Use transaction with optimistic locking - only proceed if order is still HELD
        // This prevents duplicate transfers if cron runs concurrently
        const lockedOrder = await prisma.order.updateMany({
          where: {
            id: order.id,
            paymentHoldStatus: "HELD", // Optimistic lock - only update if still HELD
          },
          data: {
            paymentHoldStatus: "RELEASED", // Claim it immediately
          },
        });

        if (lockedOrder.count === 0) {
          // Another process already claimed this order
          console.log("Order already being processed or released:", order.id);
          results.push({
            orderId: order.id,
            status: "failed",
            error: "Order already processed by another instance",
          });
          continue;
        }

        // Verify seller has Stripe Connect account
        if (!order.seller.stripeConnectId) {
          console.error("Seller missing Stripe Connect ID:", {
            orderId: order.id,
            sellerId: order.sellerId,
          });
          results.push({
            orderId: order.id,
            status: "failed",
            error: "Seller Stripe Connect not configured",
          });
          continue;
        }

        // Calculate transfer amount
        const transferAmountInPence = Math.round(
          (order.stripeSellerPayout || 0) * 100
        );

        if (transferAmountInPence <= 0) {
          console.error("Invalid transfer amount:", {
            orderId: order.id,
            sellerPayout: order.stripeSellerPayout,
          });
          results.push({
            orderId: order.id,
            status: "failed",
            error: "Invalid payout amount",
          });
          continue;
        }

        console.log("Creating auto-release transfer:", {
          orderId: order.id,
          sellerId: order.sellerId,
          amount: transferAmountInPence,
        });

        // Create transfer to seller
        const transfer = await stripe.transfers.create({
          amount: transferAmountInPence,
          currency: "gbp",
          destination: order.seller.stripeConnectId,
          transfer_group: order.id,
          metadata: {
            orderId: order.id,
            productId: order.productId,
            sellerId: order.sellerId,
            reason: "auto_release_14_days",
          },
        });

        // Update order with transfer details (status already set to RELEASED by lock)
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentReleasedAt: new Date(),
            stripeTransferId: transfer.id,
            stripePayoutStatus: "completed",
          },
        });

        console.log("Auto-release transfer successful:", {
          orderId: order.id,
          transferId: transfer.id,
        });

        results.push({
          orderId: order.id,
          status: "success",
          transferId: transfer.id,
        });

        // Send email notification to seller about payment release
        try {
          await sendPaymentReleasedEmail({
            sellerEmail: order.seller.email,
            sellerName: order.seller.firstName || "Seller",
            orderId: order.id,
            productTitle: order.product.title,
            payoutAmount: order.stripeSellerPayout || 0,
            releaseReason: "auto_released",
          });
          console.log("Payment released email sent to seller:", order.seller.email);
        } catch (emailError) {
          console.error("Failed to send payment released email:", emailError);
          // Don't fail the release if email fails
        }
      } catch (orderError) {
        console.error("Error processing order:", {
          orderId: order.id,
          error:
            orderError instanceof Error ? orderError.message : "Unknown error",
        });

        // Rollback the status if transfer failed (we set RELEASED early for locking)
        try {
          await prisma.order.update({
            where: { id: order.id },
            data: { paymentHoldStatus: "HELD" },
          });
        } catch (rollbackError) {
          console.error("Failed to rollback order status:", rollbackError);
        }

        results.push({
          orderId: order.id,
          status: "failed",
          error:
            orderError instanceof Error
              ? orderError.message
              : "Unknown error",
        });
      }
    }

    const successCount = results.filter((r) => r.status === "success").length;
    const failedCount = results.filter((r) => r.status === "failed").length;

    console.log("Auto-release cron job completed:", {
      total: ordersToRelease.length,
      success: successCount,
      failed: failedCount,
    });

    return NextResponse.json({
      success: true,
      message: `Processed ${ordersToRelease.length} orders`,
      processed: ordersToRelease.length,
      successCount,
      failedCount,
      results,
    });
  } catch (error) {
    console.error("Auto-release cron job failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
