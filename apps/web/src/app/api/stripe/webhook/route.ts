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

    // Handle payment_intent.succeeded event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      console.log('Checkout session completed:', {
        id: session.id,
        paymentIntentId: session.payment_intent,
        metadata: session.metadata,
      })

      // Retrieve full session with shipping details
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['shipping_details', 'customer_details'],
      })

      // Extract metadata
      const { productId, sellerId, buyerId } = session.metadata || {}
      
      if (!productId || !sellerId || !buyerId) {
        console.error('Missing required metadata in checkout session:', session.metadata)
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
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

      // Get buyer and seller information
      const buyer = await prisma.user.findUnique({
        where: { id: buyerId },
      })

      if (!buyer) {
        console.error('Buyer not found:', buyerId)
        return NextResponse.json({ error: 'Buyer not found' }, { status: 404 })
      }

      // For now, we'll need to get addresses from session customer_details
      // In a real app, these would be stored in the Address table
      const customerDetails = fullSession.customer_details
      // Stripe uses 'shipping' property for checkout sessions (type assertion needed for expanded property)
      const shippingDetails = (fullSession as any).shipping as { 
        address: {
          line1: string | null
          line2: string | null
          city: string | null
          state: string | null
          postal_code: string | null
          country: string | null
        }
        name: string | null
      } | null

      if (!shippingDetails?.address) {
        console.error('Missing shipping details in session')
        return NextResponse.json({ error: 'Missing shipping details' }, { status: 400 })
      }

      // Create or get addresses
      // Buyer/To Address (from shipping details)
      const toAddress = await prisma.address.create({
        data: {
          userId: buyerId,
          name: shippingDetails.name || buyer.name || buyer.email,
          street1: shippingDetails.address.line1 || '',
          street2: shippingDetails.address.line2,
          city: shippingDetails.address.city || '',
          state: shippingDetails.address.state || '',
          zip: shippingDetails.address.postal_code || '',
          country: shippingDetails.address.country || 'US',
          phone: customerDetails?.phone || undefined,
        },
      })

      // Seller/From Address (placeholder - should be from seller's profile)
      // For now, using a default address. In production, seller should provide this
      const fromAddress = await prisma.address.create({
        data: {
          userId: sellerId,
          name: product.user.name || product.user.email,
          street1: '123 Seller St', // Placeholder - should be from seller profile
          city: 'San Francisco',
          state: 'CA',
          zip: '94102',
          country: 'US',
        },
      })

      // Calculate costs
      const amountTotal = (session.amount_total || 0) / 100 // Convert from cents
      const shippingCost = (session.shipping_cost?.amount_total || 0) / 100

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

        // Create order with shipping label information
        const order = await prisma.order.create({
          data: {
            stripePaymentId: session.payment_intent as string,
            stripeCheckoutId: session.id,
            amountTotal,
            shippingCost,
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

        // TODO: Send notification emails to buyer and seller
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
            stripePaymentId: session.payment_intent as string,
            stripeCheckoutId: session.id,
            amountTotal,
            shippingCost,
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
        
        // TODO: Notify admin about failed label generation
        
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
