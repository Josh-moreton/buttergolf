# Product Data Implementation - Testing Guide

This document describes how to test the new real database product implementation across web and mobile platforms.

## Overview

The application has been updated to replace mock product data with real data from the Prisma database. This change affects:

- **Web**: RecentlyListedSection component on the home page
- **Mobile**: LoggedOutHomeScreen component
- **Shared**: ProductCard component used across both platforms

## Prerequisites

Before testing, ensure you have:

1. **Database Setup**: PostgreSQL database with connection string in `packages/db/.env`

   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/buttergolf"
   ```

2. **Prisma Client Generated**:

   ```bash
   pnpm db:generate
   ```

3. **Database Schema Applied**:

   ```bash
   pnpm db:push
   # or for production migrations
   pnpm db:migrate:dev --name add-products
   ```

4. **Sample Products in Database**: Add some products via:
   - Prisma Studio: `pnpm db:studio`
   - Seed script: `pnpm db:seed` (if available)
   - Create products via the sell page at `/sell`

## Testing Web Implementation

1. **Start the web app**:

   ```bash
   pnpm dev:web
   ```

2. **Visit the home page** at `http://localhost:3000`

3. **Expected Behavior**:
   - If products exist: The "Recently Listed" section displays real products from the database
   - If no products: An empty state is shown with "No Products Yet" message and "List an Item" button
   - Product cards show: image, title, category (with badge), condition, and price in £

4. **Verify Data**:
   - Click on a product card to navigate to the detail page
   - Verify the product ID in the URL matches the database
   - Check that categories and conditions display correctly

## Testing Mobile Implementation

1. **Configure API URL** in `apps/mobile/.env`:

   ```bash
   EXPO_PUBLIC_API_URL=http://localhost:3000
   ```

   Or for physical device testing:

   ```bash
   EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_IP:3000
   ```

2. **Start the mobile app**:

   ```bash
   pnpm dev:mobile
   ```

3. **Navigate to Logged Out Home**:
   - Open the app (not signed in)
   - Skip the onboarding screen
   - You'll see the logged-out home screen

4. **Expected Behavior**:
   - Shows "Loading products..." while fetching
   - If products exist: Displays products in a 2-column grid
   - If no products: Shows "No products available yet"
   - Product cards show: image, title, category, condition, and price in £

5. **Verify API Connection**:
   - Check mobile console logs for successful fetch
   - Ensure products match those in the database
   - Test product press callback (currently logs to console)

## API Endpoints

### GET `/api/products/recent`

Fetches recent products for mobile clients.

**Query Parameters**:

- `limit` (optional): Number of products to return (default: 12)

**Response**:

```json
[
  {
    "id": "clw1234567890",
    "title": "TaylorMade Stealth Driver",
    "price": 299.99,
    "condition": "EXCELLENT",
    "imageUrl": "https://...",
    "category": "Drivers"
  }
]
```

**Example**:

```bash
curl http://localhost:3000/api/products/recent?limit=5
```

## Server Actions (Web)

### `getRecentProducts(limit?: number)`

Server-side function to fetch products for Next.js pages.

**Usage**:

```typescript
import { getRecentProducts } from "@/app/actions/products";

export default async function Page() {
  const products = await getRecentProducts(12);
  // Use products in server component
}
```

## Shared Types

All product types are defined in `packages/app/src/types/product.ts`:

```typescript
export type ProductCondition =
  | "NEW"
  | "LIKE_NEW"
  | "EXCELLENT"
  | "GOOD"
  | "FAIR"
  | "POOR";

export interface ProductCardData {
  id: string;
  title: string;
  price: number;
  condition: ProductCondition | null;
  imageUrl: string;
  category: string;
}
```

## Troubleshooting

### Web: Empty Products Array

**Symptom**: Empty state shows even though products exist in database

**Solutions**:

1. Check database connection: `pnpm db:studio`
2. Verify products have `isSold: false`
3. Check server logs for Prisma errors
4. Ensure Prisma client is generated: `pnpm db:generate`

### Mobile: Products Not Loading

**Symptom**: Loading state persists or "No products available yet" shows

**Solutions**:

1. Check `EXPO_PUBLIC_API_URL` is set correctly
2. Verify web server is running on the configured URL
3. Check mobile console for fetch errors
4. Test API endpoint directly: `curl http://localhost:3000/api/products/recent`
5. Ensure mobile device can reach the web server (same network)

### Type Errors

**Symptom**: TypeScript errors about ProductCondition

**Solutions**:

1. Use uppercase enum values: `"EXCELLENT"` not `"Excellent"`
2. Run type check: `pnpm check-types`
3. Ensure all packages use the shared type from `@buttergolf/app`

## Next Steps

After testing, consider:

1. **Add product seeding**: Create a seed script to populate test products
2. **Add pagination**: Implement infinite scroll or pagination for product lists
3. **Add filtering**: Allow filtering by category, price range, condition
4. **Add search**: Implement product search functionality
5. **Add product navigation**: Wire up mobile onProductPress to navigate to detail screen
6. **Add caching**: Implement SWR or React Query for mobile product fetching

## Files Changed

- `packages/app/src/types/product.ts` - Shared product types
- `packages/app/src/components/ProductCard.tsx` - Updated component
- `apps/web/src/app/actions/products.ts` - Server action
- `apps/web/src/app/api/products/recent/route.ts` - API route
- `apps/web/src/app/_components/marketplace/RecentlyListedSection.tsx` - Web component
- `packages/app/src/features/home/logged-out-screen.tsx` - Mobile component
- `apps/mobile/App.tsx` - Mobile wiring
- `.env.example` - Documentation
