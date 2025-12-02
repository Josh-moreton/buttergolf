# Make an Offer - Implementation Status

## Completed ✅

### 1. Database Schema

- ✅ Added `expiresAt DateTime?` field to Offer model
- ✅ Created migration: `20251124135100_add_offer_expiration`
- ✅ Updated POST /api/offers to set 7-day expiration
- ✅ Indexed expiresAt for performance

### 2. API Routes

- ✅ GET /api/offers/[id] - Fetch single offer with conversation
- ✅ PATCH /api/offers/[id] - Accept/reject offers
- ✅ POST /api/offers/[id]/counter - Submit counter-offers
- ✅ Authorization checks (user must be buyer or seller)
- ✅ Auto-expiration check in GET route
- ✅ Counter-offer extends expiration by 7 days

### 3. Real-Time Updates

- ✅ Polling strategy documented (5-second intervals)
- ✅ WebSocket upgrade path documented
- ✅ Socket.io and socket.io-client packages installed
- 📝 TODO: Create useOfferUpdates hook for client-side polling

### 4. UI Components Created

- ✅ OfferMessage.tsx - Message bubble component
- ✅ ConversationThread.tsx - Scrollable conversation with auto-scroll
- ✅ CounterOfferForm.tsx - Form to submit counter-offers
- ✅ Validation: Seller counters lower, buyer counters higher
- ✅ date-fns installed for timestamp formatting

## In Progress 🚧

### 5. Product Summary Sidebar

**File**: `apps/web/src/app/offers/[id]/_components/ProductSummaryCard.tsx`

**Required Features**:

- Product image (first from images array)
- Title, price, condition
- Brand, model, specifications
- Seller info (name, rating)
- Sticky positioning on desktop (top: 100px)
- Action buttons:
  - **Seller**: Accept / Reject / Counter buttons
  - **Buyer**: Counter button, "Proceed to Checkout" (when accepted)
- Disabled states when offer is EXPIRED/REJECTED

**Code Pattern** (adapt from ProductInformation.tsx):

```typescript
<Column
  gap="$md"
  width="100%"
  $gtLg={{
    width: "35%",
    maxWidth: 420,
    flexShrink: 0,
  }}
  style={{
    position: "sticky",
    top: "100px",
  }}
>
  {/* Product image */}
  {/* Product details */}
  {/* Offer actions */}
</Column>
```

## Not Started 🔲

### 6. Offers Navigation Sidebar

**File**: `apps/web/src/app/offers/_components/OffersSidebar.tsx`

**Features**:

- Buying / Selling toggle (tabs or buttons)
- Filter offers by buyerId (Buying) or sellerId (Selling)
- Compact list view:
  - Product thumbnail (50x50px)
  - Product title (truncated)
  - Latest offer amount
  - Status badge (Pending, Countered, Accepted, Rejected, Expired)
  - Timestamp
- Highlight active conversation
- Click → navigate to /offers/[id]

**API**: Use existing GET /api/offers (returns all user offers)

### 7. Mobile Layout

**File**: `apps/web/src/app/offers/[id]/_components/MobileProductBar.tsx`

**Design**:

- Sticky bar at top (below header)
- Shows: product thumbnail, title, current amount
- Tap to expand (modal or slide-up sheet)
- Expanded view: full product details
- Use Tamagui Sheet component for slide-up

**Breakpoint**: Hide desktop sidebars below $gtLg (1281px)

### 8. Main Offers Page

**File**: `apps/web/src/app/offers/[id]/page.tsx`

**Structure**:

```typescript
export default async function OfferDetailPage({ params }) {
  const { userId } = await auth();
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });

  const { id } = await params;
  const offer = await prisma.offer.findUnique({
    where: { id },
    include: {
      product: { include: { images: true, user: true } },
      buyer: true,
      seller: true,
      counterOffers: { orderBy: { createdAt: 'asc' } }
    }
  });

  // Authorization check
  if (offer.buyerId !== user.id && offer.sellerId !== user.id) {
    redirect('/offers');
  }

  return <OfferDetailClient offer={offer} currentUserId={user.id} />;
}
```

**Client Component** (`OfferDetailClient.tsx`):

- Three-column layout (Desktop):
  - Left: OffersSidebar (20%)
  - Center: ConversationThread + CounterOfferForm (45%)
  - Right: ProductSummaryCard (35%)
- Mobile: Stack vertically, MobileProductBar at top
- Polling: useOfferUpdates hook (refetch every 5s)

### 9. Offers List Page

**File**: `apps/web/src/app/offers/page.tsx`

**Features**:

- Server-side auth
- Fetch all offers (GET /api/offers)
- Empty state: "No offers yet. Make an offer on a product to get started."
- List view with OfferCard components
- Filter tabs: All / Buying / Selling / Pending / Accepted
- Click → navigate to /offers/[id]

### 10. Email Notifications

**File**: `apps/web/src/lib/email/offer-notifications.ts`

**Functions Needed**:

```typescript
- sendOfferCreatedEmail(offer) → Notify seller
- sendCounterOfferEmail(offer, counterOffer) → Notify other party
- sendOfferAcceptedEmail(offer) → Notify both parties
- sendOfferRejectedEmail(offer) → Notify both parties
- sendOfferExpiringEmail(offer) → 24h before expiration
```

**Integration Points**:

- Uncomment line 88 in POST /api/offers
- Add to POST /api/offers/[id]/counter (line 146)
- Add to PATCH /api/offers/[id] (line 179)

**Email Service**: Use existing Resend setup (if configured) or Sendgrid

## Testing Checklist 🧪

- [ ] Create offer from product page
- [ ] Seller receives offer notification
- [ ] Seller can accept/reject/counter
- [ ] Buyer receives counter-offer notification
- [ ] Buyer can counter-offer
- [ ] Conversation displays correctly
- [ ] Offer expires after 7 days
- [ ] Expired offers cannot be countered
- [ ] Accepted offers show "Proceed to Checkout" button
- [ ] Mobile layout works (expandable product bar)
- [ ] Polling updates conversation in real-time
- [ ] Authorization prevents viewing others' offers

## Next Steps

1. **Product Summary Sidebar** - Extract and adapt ProductInformation component
2. **Offers Sidebar** - Build navigation with Buying/Selling toggle
3. **Mobile Layout** - Implement expandable product bar with Sheet
4. **Main Page** - Wire everything together with three-column layout
5. **Email Notifications** - Integrate Resend/Sendgrid
6. **Polish** - Error states, loading states, animations
7. **Testing** - End-to-end flow testing

## Architecture Notes

### Why Polling Over WebSocket Initially?

- Simpler to implement and deploy
- No custom server needed (works with Vercel/Netlify)
- 5-second polling is acceptable UX for MVP
- Easy upgrade path to WebSocket later

### Mobile Design Philosophy

- **Problem**: Three columns don't fit on mobile
- **Solution**:
  - Full-screen conversation (primary focus)
  - Sticky product bar at top (collapsed by default)
  - Tap to expand product details
  - Offers sidebar accessible via hamburger menu or separate page

### Data Flow

```
User Action → API Route → Database → Response
                           ↓
                    useOfferUpdates (polling)
                           ↓
                    UI Updates
```

## Files Created

```
packages/db/prisma/schema.prisma (modified)
packages/db/prisma/migrations/20251124135100_add_offer_expiration/migration.sql
apps/web/src/app/api/offers/[id]/route.ts
apps/web/src/app/api/offers/[id]/counter/route.ts
apps/web/src/app/api/offers/route.ts (modified)
apps/web/src/app/offers/[id]/_components/OfferMessage.tsx
apps/web/src/app/offers/[id]/_components/ConversationThread.tsx
apps/web/src/app/offers/[id]/_components/CounterOfferForm.tsx
docs/WEBSOCKET_IMPLEMENTATION.md
```

## Dependencies Added

- socket.io
- socket.io-client
- date-fns
