# Payments & Escrow

ButterGolf uses **Stripe Connect** with the **Separate Charges and Transfers** pattern — a platform-escrow model where the seller need not be onboarded at checkout time. This is one of three official Stripe Connect charge types, explicitly designed for marketplaces where the recipient isn't known at payment time.

**Core principle**: Stripe onboarding is never required to list or sell a product. It is only required to _receive funds_. This keeps the listing and purchasing experience frictionless.

> This page summarizes the full model documented in `docs/STRIPE_CONNECT_MODEL.md` and `docs/STRIPE_EMBEDDED_ONBOARDING_GUIDE.md`. Refer to those docs for implementation-level detail.

## How It Works

```
SELLER:  Sign Up → List Product → Product Sells → Ship Item → Onboard Stripe → Receive Funds
         (Clerk)    (No Stripe)   (No Stripe)     (No Stripe)  (When ready)    (Transfer)

BUYER:   Browse → Purchase → Receive Item → Confirm Receipt
                    (Stripe       (Shipping)    (Triggers fund release)
                     Checkout)

Payment goes to PLATFORM account (escrow). Buyer never interacts with seller's Stripe status.
```

## Payment Lifecycle

### Step 1: Listing (No Stripe Required)

A seller creates a listing immediately after signing up with Clerk. Zero Stripe checks.

### Step 2: Purchase (Escrow to Platform)

When a buyer purchases, a Stripe Checkout Session or PaymentIntent is created. The payment goes to the **platform account** — not the seller. No `transfer_data` is used.

Payment includes:

- Product price
- Buyer protection fee (5% + £0.70, min £0.70 — from `packages/constants/src/checkout.ts`)
- Shipping (£4.99 Standard / £6.99 Express / £8.99 NextDay)

**Pricing model**: Buyer pays product + shipping + buyer protection fee. **Seller fee is 0%** — seller receives 100% of (product price + shipping). Platform revenue = buyer protection fee.

Key files:

- `apps/web/src/app/api/checkout/create-checkout-session/route.ts` — Stripe Checkout Session creation
- `apps/web/src/app/api/checkout/create-payment-intent/route.ts` — PaymentIntent creation
- `apps/web/src/lib/pricing.ts` — server-side pricing calculations
- `packages/constants/src/checkout.ts` — canonical shipping options and buyer protection fee calculation (shared by server and client)

### Step 3: Order Creation

When payment succeeds, an `Order` record is created linking buyer, seller, product, payment, shipping, and addresses.

- `apps/web/src/lib/create-order-from-payment-intent.ts` — order creation from PaymentIntent
- Order `paymentHoldStatus` starts as `HELD`

### Step 4: Delivery & Confirmation

When buyer confirms receipt (`POST /api/orders/[id]/confirm-receipt`):

- If seller **is onboarded** → `stripe.transfers.create()` with `source_transaction` linking to the original charge → order `paymentHoldStatus` becomes `RELEASED`
- If seller **not onboarded** → funds held as `PENDING_SELLER_ONBOARDING`

### Step 5: Auto-Release (Cron)

Daily Vercel cron (`/api/cron/release-payments`, 03:00 UTC) auto-releases orders where shipment is delivered and 14 days have passed. It re-verifies the Stripe charge isn't refunded/disputed before transferring, and claims each order atomically (`updateMany` with `paymentHoldStatus: "HELD"` in the WHERE clause) so concurrent runs can't double-pay. It also drains `PENDING_SELLER_ONBOARDING` orders for sellers who have since onboarded.

### Step 6: Deferred Transfer

When seller completes onboarding, the Stripe Connect `account.updated` webhook triggers `processPendingTransfersForSeller()` — releasing all held funds for that seller.

## Payment Hold Statuses

`PaymentHoldStatus` enum on `Order`:

| Status                      | Meaning                                                 |
| --------------------------- | ------------------------------------------------------- |
| `HELD`                      | Funds held on platform, awaiting delivery confirmation  |
| `PENDING_SELLER_ONBOARDING` | Buyer confirmed, but seller hasn't onboarded Stripe yet |
| `RELEASED`                  | Funds transferred to seller                             |
| `DISPUTED`                  | Chargeback or dispute opened                            |
| `REFUNDED`                  | Payment refunded to buyer                               |

## Key API Routes

| Route                                                 | Purpose                                                              |
| ----------------------------------------------------- | -------------------------------------------------------------------- |
| `POST /api/checkout/create-checkout-session`          | Create Stripe Checkout Session (web)                                 |
| `POST /api/checkout/create-payment-intent`            | Create PaymentIntent (mobile/custom flow)                            |
| `POST /api/stripe/webhook`                            | Stripe payment webhook (checkout completed, payment failed, etc.)    |
| `POST /api/stripe/connect/webhook`                    | Stripe Connect webhook (account.updated → process pending transfers) |
| `POST /api/stripe/connect/account-session`            | Create embedded component session for seller onboarding              |
| `POST /api/stripe/connect/mobile-onboard`             | Mobile onboarding flow                                               |
| `POST /api/stripe/connect/mobile-session`             | Mobile session token for Stripe onboarding                           |
| `POST /api/orders/[id]/confirm-receipt`               | Buyer confirms delivery → triggers fund release                      |
| `GET /api/orders/by-session/[sessionId]`              | Order lookup by Stripe checkout session                              |
| `GET /api/orders/by-payment-intent/[paymentIntentId]` | Order lookup by PaymentIntent                                        |

## Stripe Webhooks

Two webhook endpoints handle Stripe events:

1. **Payment webhook** (`/api/stripe/webhook`): Handles checkout session completion, payment success/failure, disputes, refunds.
2. **Connect webhook** (`/api/stripe/connect/webhook`): Handles `account.updated` events — when a seller completes onboarding, this triggers `processPendingTransfersForSeller()` to release all held funds for that seller.

## Cron Jobs (Vercel)

Configured in `vercel.json`. All cron endpoints are protected by `CRON_SECRET` (bearer token).

| Endpoint                      | Schedule                       | Purpose                                           |
| ----------------------------- | ------------------------------ | ------------------------------------------------- |
| `/api/cron/release-payments`  | `0 3 * * *` (03:00 UTC daily)  | Auto-release escrowed funds 14 days post-delivery |
| `/api/cron/payment-reminders` | `0 10 * * *` (10:00 UTC daily) | Send payment reminder emails                      |
| `/api/cron/expire-offers`     | `0 6 * * *` (06:00 UTC daily)  | Expire stale offers past their `expiresAt`        |

## Security & Ownership Guards

Several ownership/visibility guards prevent unauthorized access to payment objects (BOLA protection):

| File                                             | Guard                                                                                                            |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `apps/web/src/lib/checkout-session-ownership.ts` | Verifies who owns a Stripe Checkout Session                                                                      |
| `apps/web/src/lib/payment-intent-ownership.ts`   | Verifies who owns a Stripe PaymentIntent                                                                         |
| `apps/web/src/lib/payment-intent-visibility.ts`  | `create-payment-intent` uses `findFirst` (not `findUnique`), requires `isDraft: false` + `user.isDeleted: false` |

These guards are tested in:

- `tests/checkout-session-ownership.test.ts`
- `tests/payment-intent-ownership.test.ts`
- `tests/payment-intent-visibility.test.ts`

## Known Issues

The codebase review (`docs/CODEBASE_REVIEW.md`, June 2026) flagged several critical payment-domain issues. **Most were fixed on its branch** (commit "Fix critical payment, auth, and data integrity issues"): refunds/disputes now set `paymentHoldStatus` and the release cron re-verifies the charge before transferring; the Connect webhook payout drain uses per-order atomic claims + `release:${orderId}` idempotency keys; the double-sell guard detects conflicting orders and auto-refunds the duplicate buyer; mobile checkout collects shipping (Stripe Payment Sheet address collection) so orders are created from `paymentIntent.shipping`.

Deliberately deferred (still open):

- Mobile PaymentSheet shipping-collection UX (PAY-3 — ships in the app binary; webhook failures now return non-2xx so Stripe retries, making the failure loud rather than silent)
- Seller-set `DELIVERED` is not carrier-verified before the 14-day auto-release (PAY-6 — fraud/policy decision)
- Money fields are `Float` rather than integer pence (DB-1 — needs coordinated backfill; see [Data Model](data-model.md))

## Mobile Purchases

Mobile uses a different checkout flow than web:

- `apps/mobile/lib/wrapperActions.ts` — checkout flow hooks
- `apps/mobile/components/MobileCheckoutSheet.tsx` — native bottom-sheet checkout UI
- `apps/mobile/lib/stripe-safe.tsx` — graceful Stripe provider for Expo Go
- Mobile session: `apps/web/src/lib/mobile-session.ts` — JWT-based session (signed with `MOBILE_SESSION_SECRET`) for authenticating mobile API calls

## Stripe Onboarding Configuration

Stripe Connect Embedded Components with `controller` settings:

- `stripe_dashboard: "none"` — sellers don't see Stripe dashboard
- `fees: "application"` — platform handles fees
- `losses: "application"` — platform bears losses
- `requirement_collection: "application"` — platform collects requirements
- Capabilities: `card_payments` + `transfers`
- Country: GB

**Key constraint**: 90-day fund-hold limit for non-US (GBP) platforms. `source_transaction` is used on all transfers to earmark specific charge funds.
