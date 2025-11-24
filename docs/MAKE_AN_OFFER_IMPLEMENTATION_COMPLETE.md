# Make an Offer - Implementation Complete ✅

## Overview

The "Make an Offer" messaging system is now fully implemented with a three-column desktop layout and mobile-optimized design. Users can negotiate prices through a real-time conversation interface with automatic 7-day expiration and complete authorization checks.

## Completed Features

### 1. Database Schema ✅
- **Offer Model**: Added `expiresAt DateTime?` field with index
- **Migration**: `20251124135100_add_offer_expiration` successfully applied
- **Expiration Logic**: Offers expire 7 days after creation, extended by 7 days on each counter-offer

### 2. API Routes ✅
- **GET /api/offers/[id]**: Fetch single offer with full conversation
  - Returns offer with product, buyer, seller, counter-offers
  - Auto-updates expired offers (status → EXPIRED)
  - Authorization check (user must be buyer or seller)
  
- **PATCH /api/offers/[id]**: Accept or reject offers
  - Validates offer status (PENDING or COUNTERED)
  - Updates status to ACCEPTED or REJECTED
  - Authorization check (seller only)
  
- **POST /api/offers/[id]/counter**: Submit counter-offers
  - Validates negotiation rules (seller counters lower, buyer counters higher)
  - Minimum 50% of listed price, less than listed price
  - Creates CounterOffer record + updates Offer status to COUNTERED
  - Extends expiresAt by 7 days
  - Transaction ensures atomicity

- **POST /api/offers**: Updated to set 7-day expiration on creation

### 3. Real-Time Strategy ✅
- **Polling Implementation**: Custom `useOfferUpdates` hook
  - Fetches offer data every 5 seconds
  - Provides manual refetch function for immediate updates after actions
  - Configurable interval and enable/disable
  - Initial data from server component (no loading flash)
  
- **WebSocket Ready**: Socket.io and socket.io-client installed
  - Upgrade path documented in implementation plan
  - Polling provides solid MVP functionality

### 4. UI Components ✅

#### Core Components
1. **OfferMessage** - Message bubble with sender identification
   - Buyer/seller styling differentiation (primary vs surface background)
   - Displays: sender name, amount, optional message, timestamp
   - Badge for "Initial Offer" vs "Counter"
   - Uses formatDistanceToNow for relative timestamps

2. **ConversationThread** - Scrollable conversation with auto-scroll
   - Displays initial offer + all counter-offers chronologically
   - Auto-scrolls to bottom on new messages
   - Loading state with spinner
   - Empty states for buyer vs seller perspectives
   - max-height with overflow-y: auto for scrolling

3. **CounterOfferForm** - Role-based counter-offer submission
   - Amount input with £ prefix, optional message textarea
   - Client-side validation:
     * Seller must counter lower than current amount
     * Buyer must counter higher than current amount
     * Minimum 50% of listed price
     * Less than listed price
   - Disabled when offer is accepted/rejected/expired
   - Submits to POST /api/offers/[id]/counter
   - Calls onSuccess callback to refetch data

4. **ProductSummaryCard** - Product details sidebar (desktop)
   - Product image (first from array), title, listed price
   - Current offer amount and status badge
   - Seller info with rating (star icon + average + count)
   - Product specs: brand, model, condition (formatted)
   - Conditional action buttons:
     * Accepted + Buyer: "Proceed to Checkout" (navigates to /checkout/[id]?offerId=[id])
     * Active + Seller: "Accept Offer" + "Reject Offer"
     * Expired/Rejected: Empty state message
   - Sticky positioning: top: 100px
   - Width: 35% on $gtLg (1281px+), full-width on mobile

5. **OffersSidebar** - Navigation with Buying/Selling toggle (desktop)
   - Two buttons for Buying/Selling tabs with active styling
   - Filters offers by buyerId (Buying) or sellerId (Selling)
   - Compact offer cards: thumbnail (50x50), title (truncated 2 lines), amount, status badge, timestamp
   - Highlights active conversation (border: 2px primary when offer.id matches)
   - Sticky positioning: top: 100px, max-height: calc(100vh - 120px)
   - Width: 20% on $gtLg, min 250px, max 300px
   - Fetches ALL offers from GET /api/offers

6. **MobileProductBar** - Mobile-optimized product details (< $gtLg)
   - Sticky bar: position: sticky, top: 80px, z-index: 50
   - Bar content: thumbnail (60x60), title (truncated), current offer amount, status badge, chevron down
   - Click opens Tamagui Sheet with 85% snap point
   - Expanded content:
     * Full product image (250px height)
     * Status badge, title, listed vs current offer prices
     * Seller info with rating
     * Product specs (brand/model/condition)
     * Action buttons (Accept/Reject for sellers)
   - Buttons in sheet close sheet + call action handlers

#### Page Components
7. **OfferDetailClient** - Main three-column layout
   - Three-column desktop layout:
     * Left (20%): OffersSidebar (hidden below $gtLg)
     * Center (45%): ConversationThread + CounterOfferForm
     * Right (35%): ProductSummaryCard (hidden below $gtLg)
   - Mobile layout:
     * MobileProductBar at top (sticky)
     * Full-screen conversation + form
   - Polling for real-time updates (5 seconds)
   - Action handlers:
     * handleAccept: PATCH /api/offers/[id] with action: "accept"
     * handleReject: PATCH /api/offers/[id] with action: "reject"
     * handleCounterOfferSuccess: Refetches offer data
   - Loading states and error handling
   - Fetches all offers for sidebar on mount

8. **OfferDetailPage** - Server component with auth and data fetching
   - Server Component with Clerk auth()
   - Fetches user from Prisma (clerkId → user.id mapping)
   - Fetches offer with all includes (product, images, buyer, seller, counter-offers)
   - Authorization checks:
     * User must be authenticated
     * User must be buyer or seller
     * Redirects to /sign-in or /offers on failure
   - Passes data to OfferDetailClient
   - Route: /offers/[id]
   - Dynamic rendering (export const dynamic = "force-dynamic")

### 5. Custom Hooks ✅
- **useOfferUpdates**: Polling hook for real-time updates
  - Parameters: offerId, enabled, interval, initialOffer
  - Returns: { offer, loading, error, refetch }
  - Uses fetch with 5-second interval
  - Cleanup on unmount (clearInterval)
  - Manual refetch function for immediate updates

## Architecture Patterns

### Server Component → Client Component Flow
```typescript
// Server Component (page.tsx)
export default async function OfferDetailPage({ params }: PageProps) {
  const { userId } = await auth();
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  const offer = await prisma.offer.findUnique({ where: { id }, include: {...} });
  
  // Authorization checks
  if (offer.buyerId !== user.id && offer.sellerId !== user.id) redirect('/offers');
  
  return <OfferDetailClient offer={offer} currentUserId={user.id} />;
}

// Client Component (OfferDetailClient.tsx)
export function OfferDetailClient({ offer: initialOffer, currentUserId }) {
  const { offer, refetch } = useOfferUpdates({ offerId: initialOffer.id, initialOffer });
  
  // Interactive UI with actions and real-time updates
}
```

### Responsive Layout Strategy
- **Desktop ($gtLg: 1281px+)**: Three columns side-by-side
- **Tablet ($md - $gtLg)**: Hide sidebars, full-width conversation
- **Mobile (< $md)**: Hide sidebars, add sticky product bar with Sheet expansion

### Authorization Pattern
- Server-side auth checks in page.tsx (prevents unauthorized access)
- API routes verify user is buyer or seller before returning data
- Client components receive pre-authorized data from server
- Actions (accept/reject/counter) re-verified server-side in API routes

### Data Flow
1. Server fetches initial offer data (with auth)
2. Client receives data, starts polling (5-second interval)
3. User performs action (accept/reject/counter)
4. Action handler calls API route, waits for response
5. On success, calls refetch() to immediately update UI
6. Polling continues in background for other users' actions

## File Structure

```
apps/web/src/
├── app/
│   ├── offers/
│   │   ├── [id]/
│   │   │   ├── page.tsx                       # Server component with auth and data fetching
│   │   │   └── _components/
│   │   │       ├── OfferDetailClient.tsx      # Main three-column layout
│   │   │       ├── ConversationThread.tsx     # Scrollable conversation
│   │   │       ├── OfferMessage.tsx           # Message bubble component
│   │   │       ├── CounterOfferForm.tsx       # Counter-offer submission
│   │   │       ├── ProductSummaryCard.tsx     # Product sidebar (desktop)
│   │   │       └── MobileProductBar.tsx       # Product bar (mobile)
│   │   └── _components/
│   │       └── OffersSidebar.tsx              # Navigation sidebar (desktop)
│   └── api/
│       └── offers/
│           ├── route.ts                        # GET (list) and POST (create)
│           └── [id]/
│               ├── route.ts                    # GET (single) and PATCH (accept/reject)
│               └── counter/
│                   └── route.ts                # POST (submit counter-offer)
├── hooks/
│   └── useOfferUpdates.ts                      # Polling hook for real-time updates
└── lib/
    └── email/
        └── offer-notifications.ts              # Email notification functions (TODO)
```

## Testing Checklist

### Manual Testing Steps
1. ✅ Create offer on product page
2. ✅ Navigate to /offers/[id]
3. ✅ Verify three-column layout on desktop
4. ✅ Verify mobile layout with expandable product bar
5. ✅ Submit counter-offer (seller)
6. ✅ Submit counter-offer (buyer)
7. ✅ Validate: seller can only counter lower, buyer can only counter higher
8. ✅ Validate: minimum 50% of listed price
9. ✅ Accept offer (seller)
10. ✅ Verify "Proceed to Checkout" button appears (buyer)
11. ✅ Reject offer (seller)
12. ✅ Verify offer expires after 7 days (manual database update)
13. ✅ Verify polling updates UI every 5 seconds
14. ✅ Verify authorization (try accessing another user's offer)

### Unit Testing (Future)
- [ ] API route authorization checks
- [ ] Counter-offer validation logic
- [ ] Expiration date calculations
- [ ] Polling hook behavior

### Integration Testing (Future)
- [ ] Complete offer negotiation flow (create → counter → accept)
- [ ] Expiration workflow (create → wait 7 days → verify EXPIRED status)
- [ ] Authorization failures (unauthorized access attempts)

## Remaining Work

### 1. Email Notifications 📝
- [ ] Create email templates (offer created, counter-offer, accepted, rejected)
- [ ] Implement sendOfferCreatedEmail function
- [ ] Implement sendCounterOfferEmail function
- [ ] Implement sendOfferAcceptedEmail function
- [ ] Implement sendOfferRejectedEmail function
- [ ] Uncomment TODO in POST /api/offers (line 88)
- [ ] Add email calls to POST /api/offers/[id]/counter (line 146)
- [ ] Add email calls to PATCH /api/offers/[id] (line 179)

### 2. Toast Notifications 📝
- [ ] Install toast library (react-hot-toast or sonner)
- [ ] Add success toasts for accept/reject/counter actions
- [ ] Add error toasts for failed actions
- [ ] Replace TODO comments in OfferDetailClient.tsx (lines 118, 121, 149, 152)

### 3. Offers List Page 📝
- [ ] Create /offers page with list of all offers
- [ ] Filter tabs: All / Buying / Selling
- [ ] Empty state: "No offers yet..."
- [ ] Offer cards with thumbnail, title, amount, status, timestamp
- [ ] Click card → navigate to /offers/[id]

### 4. WebSocket Upgrade (Optional) 🔮
- [ ] Create Socket.io server in Next.js API route
- [ ] Emit events on offer actions (accept, reject, counter)
- [ ] Update useOfferUpdates to use WebSocket instead of polling
- [ ] Add connection status indicator
- [ ] Fallback to polling if WebSocket fails

### 5. Checkout Integration 📝
- [ ] Create /checkout/[productId] page
- [ ] Accept offerId query parameter
- [ ] Show accepted offer amount (not listed price)
- [ ] Integrate with Stripe for payment processing
- [ ] Update order records with offerI
- [ ] Mark offer as "completed" after successful purchase

## Dependencies Added

```json
{
  "dependencies": {
    "socket.io": "^4.8.2",
    "socket.io-client": "^4.8.2",
    "date-fns": "^4.1.0"
  }
}
```

## Key Learnings

1. **Component Prop Consistency**: Keep prop interfaces consistent between components to avoid refactoring cascades
2. **Server/Client Split**: Server components for auth + data fetching, client components for interactivity
3. **Polling vs WebSocket**: Polling is simpler for MVP, WebSocket better for scale (both work!)
4. **Mobile-First Design**: Expandable Sheet component works great for mobile product details
5. **Sticky Positioning**: Use sticky positioning for sidebars to keep them in view while scrolling
6. **Auto-Scroll**: useRef + useEffect pattern works well for auto-scrolling conversations
7. **Type Safety**: Prisma.OfferGetPayload pattern provides type-safe includes
8. **Authorization Layers**: Server component auth + API route auth provides defense in depth

## Next Steps

To complete the implementation:

1. **Add toast notifications** for better UX feedback (react-hot-toast)
2. **Create offers list page** (/offers) for discovery and navigation
3. **Implement email notifications** using existing email service (Resend or Sendgrid)
4. **Test end-to-end flow** with real users and multiple devices
5. **Add checkout integration** to complete purchase after accepted offers
6. **Consider WebSocket upgrade** if polling becomes a performance issue

The core messaging system is fully functional and ready for user testing! 🎉
