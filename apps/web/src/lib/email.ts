import { Resend } from "resend";

/**
 * Email Service using Resend
 *
 * Handles all transactional emails for ButterGolf:
 * - Order confirmations
 * - New sale notifications
 * - Shipping updates
 * - New message notifications
 *
 * Environment: RESEND_API_KEY
 */

const resend = new Resend(process.env.RESEND_API_KEY);

// Use verified Resend domain for sending emails
const FROM_EMAIL = "ButterGolf <notifications@notifications.buttergolf.com>";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://buttergolf.co.uk";

interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Send order confirmation email to buyer
 */
export async function sendOrderConfirmationEmail(params: {
  buyerEmail: string;
  buyerName: string;
  orderId: string;
  productTitle: string;
  productImage?: string;
  amountTotal: number;
  sellerName: string;
}): Promise<EmailResult> {
  const { buyerEmail, buyerName, orderId, productTitle, amountTotal, sellerName } = params;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: buyerEmail,
      subject: `Order Confirmed: ${productTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #323232; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #F45314; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .content { background: #FFFAD2; padding: 30px; border-radius: 0 0 8px 8px; }
            .order-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background: #F45314; color: white; padding: 12px 24px; text-decoration: none; border-radius: 24px; font-weight: 600; }
            .footer { text-align: center; padding: 20px; color: #545454; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Order Confirmed!</h1>
            </div>
            <div class="content">
              <p>Hi ${buyerName},</p>
              <p>Great news! Your order has been confirmed and the seller has been notified.</p>
              
              <div class="order-box">
                <h3 style="margin-top: 0;">Order Details</h3>
                <p><strong>Order ID:</strong> ${orderId.slice(0, 8).toUpperCase()}</p>
                <p><strong>Product:</strong> ${productTitle}</p>
                <p><strong>Seller:</strong> ${sellerName}</p>
                <p><strong>Total Paid:</strong> £${amountTotal.toFixed(2)}</p>
              </div>
              
              <h3>What happens next?</h3>
              <ul>
                <li>The seller will prepare your item and create a shipping label</li>
                <li>You'll receive tracking information once shipped</li>
                <li>Track your order anytime in your account</li>
              </ul>
              
              <p style="text-align: center; margin-top: 30px;">
                <a href="${BASE_URL}/orders/${orderId}" class="button">View Order</a>
              </p>
            </div>
            <div class="footer">
              <p>Thank you for shopping with ButterGolf!</p>
              <p>Questions? Reply to this email or visit our help centre.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error("Email send error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Send new sale notification email to seller
 */
export async function sendNewSaleEmail(params: {
  sellerEmail: string;
  sellerName: string;
  orderId: string;
  productTitle: string;
  buyerName: string;
  amountTotal: number;
  sellerPayout: number;
  shippingAddress: {
    city: string;
    zip: string;
  };
}): Promise<EmailResult> {
  const { sellerEmail, sellerName, orderId, productTitle, buyerName, amountTotal, sellerPayout, shippingAddress } = params;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: sellerEmail,
      subject: `🎉 You made a sale! ${productTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #323232; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #F45314; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .content { background: #FFFAD2; padding: 30px; border-radius: 0 0 8px 8px; }
            .order-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .payout-box { background: #02aaa4; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .button { display: inline-block; background: #F45314; color: white; padding: 12px 24px; text-decoration: none; border-radius: 24px; font-weight: 600; }
            .footer { text-align: center; padding: 20px; color: #545454; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Congratulations!</h1>
            </div>
            <div class="content">
              <p>Hi ${sellerName},</p>
              <p>You just made a sale! Time to ship it out.</p>
              
              <div class="payout-box">
                <p style="margin: 0; font-size: 14px;">Your Payout</p>
                <p style="margin: 5px 0 0 0; font-size: 32px; font-weight: bold;">£${sellerPayout.toFixed(2)}</p>
              </div>
              
              <div class="order-box">
                <h3 style="margin-top: 0;">Order Details</h3>
                <p><strong>Order ID:</strong> ${orderId.slice(0, 8).toUpperCase()}</p>
                <p><strong>Product:</strong> ${productTitle}</p>
                <p><strong>Buyer:</strong> ${buyerName}</p>
                <p><strong>Ship To:</strong> ${shippingAddress.city}, ${shippingAddress.zip}</p>
                <p><strong>Order Total:</strong> £${amountTotal.toFixed(2)}</p>
              </div>
              
              <h3>Next Steps:</h3>
              <ol>
                <li>Go to your Sales dashboard</li>
                <li>Click "Generate Label" to get your shipping label</li>
                <li>Print the label and attach it to your package</li>
                <li>Drop off at your nearest carrier location</li>
              </ol>
              
              <p style="text-align: center; margin-top: 30px;">
                <a href="${BASE_URL}/seller/sales" class="button">Generate Shipping Label</a>
              </p>
            </div>
            <div class="footer">
              <p>Thanks for selling on ButterGolf!</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error("Email send error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Send shipping notification email to buyer
 */
export async function sendShippedEmail(params: {
  buyerEmail: string;
  buyerName: string;
  orderId: string;
  productTitle: string;
  trackingCode: string;
  trackingUrl: string;
  carrier: string;
  estimatedDelivery?: string;
}): Promise<EmailResult> {
  const { buyerEmail, buyerName, orderId, productTitle, trackingCode, trackingUrl, carrier, estimatedDelivery } = params;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: buyerEmail,
      subject: `📦 Your order is on its way! ${productTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #323232; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #F45314; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .content { background: #FFFAD2; padding: 30px; border-radius: 0 0 8px 8px; }
            .tracking-box { background: #3c50e0; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .button { display: inline-block; background: #F45314; color: white; padding: 12px 24px; text-decoration: none; border-radius: 24px; font-weight: 600; }
            .button-secondary { display: inline-block; background: white; color: #F45314; padding: 12px 24px; text-decoration: none; border-radius: 24px; font-weight: 600; border: 2px solid #F45314; }
            .footer { text-align: center; padding: 20px; color: #545454; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📦 Your Order Has Shipped!</h1>
            </div>
            <div class="content">
              <p>Hi ${buyerName},</p>
              <p>Great news! Your order is on its way to you.</p>
              
              <div class="tracking-box">
                <p style="margin: 0; font-size: 14px;">Tracking Number</p>
                <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold;">${trackingCode}</p>
                <p style="margin: 10px 0 0 0; font-size: 14px;">via ${carrier}</p>
                ${estimatedDelivery ? `<p style="margin: 10px 0 0 0; font-size: 14px;">Est. Delivery: ${new Date(estimatedDelivery).toLocaleDateString()}</p>` : ""}
              </div>
              
              <p><strong>Product:</strong> ${productTitle}</p>
              <p><strong>Order ID:</strong> ${orderId.slice(0, 8).toUpperCase()}</p>
              
              <p style="text-align: center; margin-top: 30px;">
                <a href="${trackingUrl}" class="button">Track Package</a>
              </p>
              <p style="text-align: center; margin-top: 15px;">
                <a href="${BASE_URL}/orders/${orderId}" class="button-secondary">View Order</a>
              </p>
            </div>
            <div class="footer">
              <p>Happy golfing!</p>
              <p>The ButterGolf Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error("Email send error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Send new message notification email
 */
export async function sendNewMessageEmail(params: {
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  orderId: string;
  productTitle: string;
  messagePreview: string;
}): Promise<EmailResult> {
  const { recipientEmail, recipientName, senderName, orderId, productTitle, messagePreview } = params;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: `New message about your order: ${productTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #323232; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #F45314; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 20px; }
            .content { background: #FFFAD2; padding: 30px; border-radius: 0 0 8px 8px; }
            .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F45314; }
            .button { display: inline-block; background: #F45314; color: white; padding: 12px 24px; text-decoration: none; border-radius: 24px; font-weight: 600; }
            .footer { text-align: center; padding: 20px; color: #545454; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💬 New Message</h1>
            </div>
            <div class="content">
              <p>Hi ${recipientName},</p>
              <p><strong>${senderName}</strong> sent you a message about order <strong>${orderId.slice(0, 8).toUpperCase()}</strong>:</p>
              
              <div class="message-box">
                <p style="margin: 0; font-style: italic;">"${messagePreview.slice(0, 200)}${messagePreview.length > 200 ? "..." : ""}"</p>
              </div>
              
              <p><strong>Product:</strong> ${productTitle}</p>
              
              <p style="text-align: center; margin-top: 30px;">
                <a href="${BASE_URL}/orders/${orderId}" class="button">View & Reply</a>
              </p>
            </div>
            <div class="footer">
              <p>Reply directly on ButterGolf to keep the conversation in one place.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error("Email send error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Send delivery confirmation email to both parties
 */
export async function sendDeliveredEmail(params: {
  email: string;
  name: string;
  orderId: string;
  productTitle: string;
  isBuyer: boolean;
}): Promise<EmailResult> {
  const { email, name, orderId, productTitle, isBuyer } = params;

  const subject = isBuyer
    ? `✅ Your order has been delivered! ${productTitle}`
    : `✅ Your sale has been delivered! ${productTitle}`;

  const message = isBuyer
    ? "Your package has been delivered! We hope you love your new golf gear."
    : "Great news! The buyer has received their package.";

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #323232; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #02aaa4; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .content { background: #FFFAD2; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #F45314; color: white; padding: 12px 24px; text-decoration: none; border-radius: 24px; font-weight: 600; }
            .footer { text-align: center; padding: 20px; color: #545454; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Delivered!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>${message}</p>
              
              <p><strong>Product:</strong> ${productTitle}</p>
              <p><strong>Order ID:</strong> ${orderId.slice(0, 8).toUpperCase()}</p>
              
              ${isBuyer ? `
                <p>If you're happy with your purchase, please leave a review for the seller!</p>
                <p style="text-align: center; margin-top: 30px;">
                  <a href="${BASE_URL}/orders/${orderId}" class="button">Leave a Review</a>
                </p>
              ` : `
                <p>Your payout will be processed according to your Stripe payout schedule.</p>
                <p style="text-align: center; margin-top: 30px;">
                  <a href="${BASE_URL}/seller/payouts" class="button">View Payouts</a>
                </p>
              `}
            </div>
            <div class="footer">
              <p>Thanks for using ButterGolf!</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error("Email send error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
