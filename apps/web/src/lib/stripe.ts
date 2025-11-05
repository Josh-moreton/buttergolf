import Stripe from 'stripe'

// Initialize Stripe client
const getStripeClient = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set')
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-10-29.clover',
  })
}

export const stripe = getStripeClient()

// Create a checkout session for a product
export async function createCheckoutSession({
  productId,
  productTitle,
  productPrice,
  shippingCost,
  sellerId,
  buyerId,
  successUrl,
  cancelUrl,
}: {
  productId: string
  productTitle: string
  productPrice: number
  shippingCost: number
  sellerId: string
  buyerId: string
  successUrl: string
  cancelUrl: string
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'], // Can be expanded as needed
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productTitle,
              metadata: {
                productId,
                sellerId,
              },
            },
            unit_amount: Math.round(productPrice * 100), // Convert to cents
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Shipping',
            },
            unit_amount: Math.round(shippingCost * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        productId,
        sellerId,
        buyerId,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    })

    return session
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error)
    throw new Error(
      `Failed to create checkout session: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
