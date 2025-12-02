# Clerk Authentication Setup

This repo is configured for Clerk auth on both Web (Next.js) and Mobile (Expo).

Follow these steps to get up and running locally:

## 1) Create a Clerk application

- Go to https://dashboard.clerk.com
- Create a new application (use "Web" + "Native" platforms)
- In the instance settings, collect:
  - Publishable key
  - Secret key
  - (Optional) Webhook signing secret (create a webhook below)

## 2) Configure environment variables

Create a `.env` at the project root or export in your shell. The following variables are used:

Web (Next.js app):

- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- CLERK_WEBHOOK_SECRET (for user sync via webhook)

Mobile (Expo app):

- EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

Database:

- DATABASE_URL (already used by Prisma in `packages/db`)

You can copy from `.env.example` and fill in the values.

## 3) Set up Clerk webhook (optional but recommended)

To sync Clerk users to the local database, add a webhook in the Clerk dashboard:

- URL: https://your-domain.com/api/clerk/webhook (or http://localhost:3000/api/clerk/webhook for local)
- Events: `user.created`, `user.updated`
- Copy the generated signing secret into `CLERK_WEBHOOK_SECRET`

The webhook handler will upsert a `User` record keyed by `clerkId`.

## 4) iOS/Android deep linking (Expo)

The mobile app is configured with the scheme `buttergolf` in `apps/mobile/app.json`.

In your Clerk instance, add redirect URLs for OAuth (use Expo proxy in dev):

- iOS/Android development: `exp://localhost:8081` is handled by Expo; Clerk's Expo SDK uses Auth Session proxy under the hood.
- You typically don't need to add explicit redirect URLs for dev with the proxy.

If you disable the proxy, configure redirect URLs like:

- `buttergolf://callback` (match the scheme configured in app.json)

## 5) Run it

- Web:
  - Ensure env vars are available to Next.js (e.g., `.env.local` in `apps/web` or exported in shell)
  - `pnpm dev:web`
  - Visit http://localhost:3000

- Mobile:
  - Ensure `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is exported in your shell
  - `pnpm dev:mobile`
  - Open iOS or Android and sign in with Google/Apple

## Notes

- Protecting routes (Web): `app/rounds/page.tsx` redirects to `/sign-in` if unauthenticated. Use `auth()` in server components to gate access.
- Header: `AuthHeader` shows a Sign In button when signed out, and a `UserButton` when signed in.
- Prisma: `User` has a `clerkId` field to link back to Clerk. Webhook events upsert local users.
- Mobile: The app is gated with `SignedIn`/`SignedOut`. A simple OAuth screen is provided.
