# Product Data Flow Architecture

This document describes how product data flows through the application across web and mobile platforms.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        PostgreSQL Database                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Products Table                                             │ │
│  │  - id, title, description, price, condition                │ │
│  │  - brand, model, userId, categoryId, isSold               │ │
│  │  - Relations: images[], category, user                     │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                               ▲
                               │ Prisma ORM
                               │
         ┌─────────────────────┴─────────────────────┐
         │                                           │
         │          Shared Types Layer              │
         │   packages/app/src/types/product.ts      │
         │   - ProductCardData interface            │
         │   - ProductCondition enum                │
         │                                           │
         └─────────────────────┬─────────────────────┘
                               │
         ┌─────────────────────┴─────────────────────┐
         │                                           │
    WEB PLATFORM                              MOBILE PLATFORM
         │                                           │
         ▼                                           ▼

┌─────────────────────────┐           ┌─────────────────────────┐
│   Next.js Web App       │           │    Expo Mobile App      │
├─────────────────────────┤           ├─────────────────────────┤
│                         │           │                         │
│  Server Component:      │           │  Client Component:      │
│  RecentlyListedSection  │           │  LoggedOutHomeScreen    │
│         │               │           │         │               │
│         ▼               │           │         ▼               │
│  Server Action:         │           │  fetch() API call       │
│  getRecentProducts()    │           │         │               │
│         │               │           │         ▼               │
│         ▼               │           │  GET /api/products/     │
│  Prisma Query           │           │      recent             │
│  (Direct DB Access)     │           │         │               │
│         │               │           │         ▼               │
│         ▼               │           │  Server Action:         │
│  Map to ProductCardData │           │  getRecentProducts()    │
│         │               │           │         │               │
│         ▼               │           │         ▼               │
│  SSR Render with data   │           │  Map to ProductCardData │
│                         │           │         │               │
└─────────────────────────┘           │         ▼               │
                                      │  Client Render with     │
                                      │  fetched data           │
                                      │                         │
                                      └─────────────────────────┘

         │                                           │
         └─────────────────────┬─────────────────────┘
                               │
                               ▼
         ┌─────────────────────────────────────────┐
         │       Shared UI Component Layer         │
         │   packages/app/src/components/          │
         │                                         │
         │   ProductCard Component                 │
         │   - Receives ProductCardData props      │
         │   - Renders with Tamagui components     │
         │   - Badge for category                  │
         │   - Condition display                   │
         │   - Price formatting (£)                │
         │                                         │
         └─────────────────────────────────────────┘
```

## Data Flow Details

### Web Platform (Server-Side Rendering)

1. **Request**: User navigates to home page
2. **Server Component**: `RecentlyListedSection` executes on server
3. **Server Action**: Calls `getRecentProducts(12)`
4. **Prisma Query**: 
   - Fetches products where `isSold = false`
   - Orders by `createdAt DESC`
   - Includes first image and category
5. **Data Mapping**: Transforms Prisma result to `ProductCardData[]`
6. **SSR**: Next.js renders component with data on server
7. **Response**: HTML with product data sent to client
8. **Hydration**: React hydrates on client with same data

**Benefits**:
- ✅ Fast initial page load (no API round-trip)
- ✅ SEO-friendly (products in HTML)
- ✅ No loading state needed

### Mobile Platform (Client-Side Fetching)

1. **Component Mount**: `LoggedOutHomeScreen` renders
2. **useEffect**: Calls `onFetchProducts()` if no products
3. **API Call**: `fetch('${API_URL}/api/products/recent')`
4. **API Route**: Next.js API route receives request
5. **Server Action**: Routes to `getRecentProducts(12)`
6. **Prisma Query**: Same query as web
7. **Data Mapping**: Transforms to `ProductCardData[]`
8. **JSON Response**: Returns product array
9. **State Update**: `setProducts()` triggers re-render
10. **Render**: ProductCard components display products

**Benefits**:
- ✅ Works with any backend
- ✅ Can be cached/refreshed independently
- ✅ Supports pull-to-refresh

## Component Hierarchy

```
App Root
│
├── Web: page.tsx
│   └── MarketplaceHomeClient
│       └── RecentlyListedSection (Server Component)
│           └── map(products) → ProductCard
│
└── Mobile: App.tsx
    └── OnboardingFlow
        └── LoggedOutHomeScreen (Client Component)
            └── map(products) → Card (inline)
                └── Product data display
```

## Type System

```typescript
// Shared across platforms
interface ProductCardData {
  id: string;              // For routing/keys
  title: string;           // Product name
  price: number;           // Numeric price
  condition: ProductCondition | null;  // Enum value
  imageUrl: string;        // First image URL
  category: string;        // Category name
}

// Ensures consistency
type ProductCondition = 
  | "NEW"
  | "LIKE_NEW"
  | "EXCELLENT"
  | "GOOD"
  | "FAIR"
  | "POOR";
```

## API Contract

### Endpoint: `GET /api/products/recent`

**Request**:
```http
GET /api/products/recent?limit=12 HTTP/1.1
Host: localhost:3000
```

**Response**:
```json
[
  {
    "id": "clw1234567890",
    "title": "TaylorMade Stealth Driver",
    "price": 299.99,
    "condition": "EXCELLENT",
    "imageUrl": "https://images.unsplash.com/...",
    "category": "Drivers"
  }
]
```

**Error Response**:
```json
{
  "error": "Failed to fetch products"
}
```

## Optimization Strategies

### Current Implementation

1. **Selective Field Fetching**: Only includes necessary fields
2. **Relation Optimization**: Uses `include` with `select` for nested data
3. **Image Limit**: Fetches only first image per product
4. **Sold Filter**: Excludes sold products to reduce result set
5. **Default Limit**: Returns max 12 products by default

### Future Improvements

1. **Pagination**: Add cursor-based pagination
   ```typescript
   getRecentProducts(limit: 12, cursor?: string)
   ```

2. **Caching**: Implement Redis cache for frequently accessed products
   ```typescript
   const cached = await redis.get('products:recent:12')
   ```

3. **Image CDN**: Use image optimization service
   ```typescript
   imageUrl: optimizeImage(product.images[0].url, { width: 400 })
   ```

4. **Query Optimization**: Add database indexes
   ```sql
   CREATE INDEX idx_products_created_sold ON products(createdAt DESC, isSold);
   ```

5. **Incremental Static Regeneration**: Use ISR on web
   ```typescript
   export const revalidate = 60; // Revalidate every 60 seconds
   ```

## Testing Strategy

### Unit Tests

```typescript
describe('getRecentProducts', () => {
  it('returns products ordered by creation date', async () => {
    const products = await getRecentProducts(5);
    expect(products).toHaveLength(5);
    expect(products[0].createdAt >= products[1].createdAt).toBe(true);
  });
  
  it('filters out sold products', async () => {
    const products = await getRecentProducts(10);
    expect(products.every(p => !p.isSold)).toBe(true);
  });
});
```

### Integration Tests

```typescript
describe('API /api/products/recent', () => {
  it('returns valid ProductCardData array', async () => {
    const response = await fetch('/api/products/recent');
    const products = await response.json();
    
    expect(Array.isArray(products)).toBe(true);
    products.forEach(product => {
      expect(product).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        price: expect.any(Number),
        category: expect.any(String),
      });
    });
  });
});
```

### E2E Tests

```typescript
describe('Web Product Display', () => {
  it('shows products on home page', async () => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="product-card"]');
    const products = await page.$$('[data-testid="product-card"]');
    expect(products.length).toBeGreaterThan(0);
  });
});
```

## Monitoring

### Key Metrics to Track

1. **API Response Time**: `/api/products/recent` latency
2. **Database Query Time**: Prisma query duration
3. **Error Rate**: Failed product fetches
4. **Cache Hit Rate**: If caching is implemented
5. **Product View Rate**: How many products are clicked

### Logging

```typescript
// In server action
console.log('Fetched products', {
  count: products.length,
  duration: Date.now() - startTime,
  filters: { isSold: false },
});
```

## Security Considerations

1. **No Authentication Required**: Products are public
2. **Rate Limiting**: Consider adding rate limits to API
3. **Input Validation**: Validate `limit` parameter
4. **SQL Injection**: Protected by Prisma ORM
5. **XSS Prevention**: React/Next.js auto-escaping

## Performance Benchmarks

Target performance metrics:

- **Web SSR**: < 200ms TTFB (Time to First Byte)
- **API Response**: < 100ms for 12 products
- **Mobile Render**: < 500ms from fetch to render
- **Database Query**: < 50ms for product fetch

These metrics should be measured under production load.
