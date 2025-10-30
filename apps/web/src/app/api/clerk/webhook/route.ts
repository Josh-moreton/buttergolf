import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { prisma } from '@buttergolf/db'
import { NextResponse } from 'next/server'

// Route Handler for Clerk webhooks
export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing CLERK_WEBHOOK_SECRET' }, { status: 500 })
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing Svix headers' }, { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: any
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })
  } catch (err) {
    console.error('Svix verify failed', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const eventType = evt.type as string

  try {
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const data = evt.data
      const clerkId: string = data.id
      const email: string | undefined = data.email_addresses?.[0]?.email_address
      const first = data.first_name ?? ''
      const last = data.last_name ?? ''
      const imageUrl: string | undefined = data.image_url

      if (!email) {
        // Skip if no email provided
        return NextResponse.json({ ok: true })
      }

      await prisma.user.upsert({
        where: { clerkId },
        update: {
          email,
          name: [first, last].filter(Boolean).join(' ') || null,
          imageUrl,
        },
        create: {
          clerkId,
          email,
          name: [first, last].filter(Boolean).join(' ') || null,
          imageUrl,
        },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Clerk webhook error', error)
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
  }
}
