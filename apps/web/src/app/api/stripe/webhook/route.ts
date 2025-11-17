import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@buttergolf/db'
import { stripe } from '@/lib/stripe'
import { createShippingLabel } from '@/lib/easypost'

// Disable body parsing for webhook
export const runtime = 'nodejs'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    console.error('Missing STRIPE_WEBHOOK_SECRET')
    return NextResponse.json({ error: 'Missing webhook secret' }, { status: 500 })
  }

  try {
    const body = await req.text()
    const headerPayload = await headers()
    const signature = headerPayload.get('stripe-signature')

    if (!signature) {
      console.error('Missing stripe-signature header')
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err instanceof Error ? err.message : 'Unknown error'}` },
        { status: 400 }
      )
    }

    console.log('Stripe webhook event received:', event.type)

    // Handle payment_intent.succeeded event (for embedded checkout)
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      console.log('Payment intent succeeded:', {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        metadata: paymentIntent.metadata,
      })

      // Extract metadata
      const {
        productId,
        sellerId,
        buyerId,
        shippingAmount,
        platformFee,
      } = paymentIntent.metadata || {}

      if (!productId || !sellerId || !buyerId) {
        console.error('Missing required metadata in payment intent:', paymentIntent.metadata)
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
      }

      // Check if order already exists (idempotency check)
      const existingOrder = await prisma.order.findUnique({
        where: { stripePaymentId: paymentIntent.id },
      })

      if (existingOrder) {
        console.log('Order already exists for payment intent:', paymentIntent.id)
        return NextResponse.json({
          received: true,
          orderId: existingOrder.id,
          message: 'Order already processed',
        })
      }

      // Get product details including shipping dimensions
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          user: true,
        },
      })

      if (!product) {
        console.error('Product not found:', productId)
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }

      // Get buyer information
      const buyer = await prisma.user.findUnique({
        where: { id: buyerId },
      })

      if (!buyer) {
        console.error('Buyer not found:', buyerId)
        return NextResponse.json({ error: 'Buyer not found' }, { status: 404 })
      }

      // Get shipping details from the PaymentIntent
      const shipping = paymentIntent.shipping

      if (!shipping?.address) {
        console.error('Missing shipping details in payment intent')
        return NextResponse.json({ error: 'Missing shipping details' }, { status: 400 })
      }

      // Create or get addresses
      // Buyer/To Address (from shipping details)
      const toAddress = await prisma.address.create({
        data: {
          userId: buyerId,
          name: shipping.name || buyer.name || buyer.email,
          street1: shipping.address.line1 || '',
          street2: shipping.address.line2,
          city: shipping.address.city || '',
          state: shipping.address.state || '',
          zip: shipping.address.postal_code || '',
          country: shipping.address.country || 'US',
          phone: shipping.phone || undefined,
        },
      })

      // Seller/From Address (placeholder - should be from seller's profile)
      // NOTE: Implement proper seller address collection when seller profile form ships
      // This is a placeholder for testing. In production:
      // 1. Add seller address form to user profile
      // 2. Store in Address table with userId = sellerId
      // 3. Fetch here: await prisma.address.findFirst({ where: { userId: sellerId, isDefault: true } })
      // For now, using a test address that works with EasyPost sandbox
      const fromAddress = await prisma.address.create({
        data: {
          userId: sellerId,
          name: product.user.name || product.user.email,
          street1: '388 Townsend St', // EasyPost test address
          street2: 'Apt 20',
          city: 'San Francisco',
          state: 'CA',
          zip: '94107',
          country: 'US',
          phone: '555-555-5555',
        },
      })

      // Calculate costs from metadata
      const amountTotal = paymentIntent.amount / 100 // Convert from cents
      const shippingCost = Number.parseFloat(shippingAmount ?? '0') / 100
      const platformFeeAmount = Number.parseFloat(platformFee ?? '0') / 100
      const sellerPayout = amountTotal - platformFeeAmount

      try {
        // Create shipping label via EasyPost
        // Use product dimensions or default values
        const parcelDimensions = {
          length: product.length || 30, // Default 30cm
          width: product.width || 20,   // Default 20cm
          height: product.height || 10, // Default 10cm
          weight: product.weight || 500, // Default 500g
        }

        const labelResult = await createShippingLabel(
          {
            name: fromAddress.name,
            street1: fromAddress.street1,
            street2: fromAddress.street2,
            city: fromAddress.city,
            state: fromAddress.state,
            zip: fromAddress.zip,
            country: fromAddress.country,
            phone: fromAddress.phone,
          },
          {
            name: toAddress.name,
            street1: toAddress.street1,
            street2: toAddress.street2,
            city: toAddress.city,
            state: toAddress.state,
            zip: toAddress.zip,
            country: toAddress.country,
            phone: toAddress.phone,
          },
          parcelDimensions
        )

        // Create order with shipping label and payout tracking
        const order = await prisma.order.create({
          data: {
            stripePaymentId: paymentIntent.id,
            amountTotal,
            shippingCost,
            stripePlatformFee: platformFeeAmount,
            stripeSellerPayout: sellerPayout,
            stripePayoutStatus: 'pending', // Stripe will handle the transfer automatically
            sellerId,
            buyerId,
            productId,
            fromAddressId: fromAddress.id,
            toAddressId: toAddress.id,
            easypostShipmentId: labelResult.shipmentId,
            labelUrl: labelResult.labelUrl,
            labelFormat: labelResult.labelFormat,
            trackingCode: labelResult.trackingCode,
            trackingUrl: labelResult.trackingUrl,
            carrier: labelResult.carrier,
            service: labelResult.service,
            shipmentStatus: 'PRE_TRANSIT',
            status: 'LABEL_GENERATED',
            labelGeneratedAt: new Date(),
          },
        })

        // Mark product as sold
        await prisma.product.update({
          where: { id: productId },
          data: { isSold: true },
        })

        console.log('Order created successfully:', order.id)

        // NOTE: Send notification emails to buyer and seller when notification service is ready
        // - Seller: Label ready for download
        // - Buyer: Order confirmation with tracking info

        return NextResponse.json({
          received: true,
          orderId: order.id,
          trackingCode: order.trackingCode,
        })
      } catch (error) {
        console.error('Error creating shipping label or order:', error)

        // Create order without label (label generation failed)
        const order = await prisma.order.create({
          data: {
            stripePaymentId: paymentIntent.id,
            amountTotal,
            shippingCost,
            stripePlatformFee: platformFeeAmount,
            stripeSellerPayout: sellerPayout,
            stripePayoutStatus: 'pending',
            sellerId,
            buyerId,
            productId,
            fromAddressId: fromAddress.id,
            toAddressId: toAddress.id,
            shipmentStatus: 'PENDING',
            status: 'PAYMENT_CONFIRMED',
          },
        })

        console.error('Order created without label due to error:', order.id)

        // NOTE: Notify admin about failed label generation when alerting pipeline exists

        return NextResponse.json({
          received: true,
          orderId: order.id,
          warning: 'Label generation failed',
        })
      }
    }

    // Handle other event types if needed
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
