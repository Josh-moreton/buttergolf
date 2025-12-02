# Products Feature

This directory contains the cross-platform product screens for the ButterGolf mobile and web applications.

## Components

### ProductsScreen (`list-screen.tsx`)

Displays a grid of product cards with:

- Product images
- Titles
- Prices
- Categories
- Condition badges

**Features**:

- Loading state with spinner
- Error handling
- Empty state
- Solito navigation to product details
- Responsive grid layout

**Usage**:

```typescript
import { ProductsScreen } from '@buttergolf/app'

<ProductsScreen
  onFetchProducts={async () => {
    // Fetch products from API
    return products
  }}
/>
```

### ProductDetailScreen (`detail-screen.tsx`)

Shows full product information including:

- Primary product image
- Product gallery
- Title and category
- Condition badge
- Price
- Description
- Seller information
- "Contact Seller" button

**Features**:

- Loading state
- Error handling
- "Product not found" handling
- Back navigation
- Image gallery
- Solito integration

**Usage**:

```typescript
import { ProductDetailScreen } from '@buttergolf/app'

<ProductDetailScreen
  productId="abc123"
  onFetchProduct={async (id) => {
    // Fetch product by ID
    return product
  }}
/>
```

## Integration

### Mobile (Expo)

```typescript
// apps/mobile/App.tsx
import { ProductsScreen, ProductDetailScreen } from '@buttergolf/app'

<Stack.Screen name="Products">
  {() => <ProductsScreen onFetchProducts={fetchProducts} />}
</Stack.Screen>

<Stack.Screen name="ProductDetail">
  {({ route }) => (
    <ProductDetailScreen
      productId={route.params?.id}
      onFetchProduct={fetchProduct}
    />
  )}
</Stack.Screen>
```

### Web (Next.js)

Web uses page-based routing:

- `/products/[id]` → `apps/web/src/app/products/[id]/page.tsx`
- Uses `ProductDetailClient` component (web-specific wrapper)

## Navigation

### Solito Routes

```typescript
// packages/app/src/navigation/routes.ts
export const routes = {
  products: "/products",
  productDetail: "/products/[id]",
};
```

### Deep Linking

Both iOS and Android deep links work:

- `https://buttergolf.com/products/123` → Opens app to product detail
- Configured via `.well-known` files in web app

## Data Flow

```
User Action
    ↓
Component renders with loading state
    ↓
onFetchProduct(id) or onFetchProducts() called
    ↓
API request to backend
    ↓
Data returned or error
    ↓
Component renders with data or error message
```

## Types

All product types are defined in `packages/app/src/types/product.ts`:

- `Product`: Full product object
- `ProductCardData`: Minimal data for list view
- `ProductCondition`: Enum of condition values
- `ProductImage`: Image object with URL
- `ProductUser`: Seller information
- `ProductCategory`: Category information

## Styling

Uses components from `@buttergolf/ui`:

- `Card` for product containers
- `Image` for product photos
- `Text` for typography
- `Badge` for condition indicators
- `Button` for actions
- `Column` and `Row` for layout
- `ScrollView` for scrollable content
- `Spinner` for loading states

## Error Handling

Both screens handle:

- Loading states (spinner + text)
- Network errors (error message + back button)
- Empty states (no products message)
- Missing data (graceful degradation)

## Performance

- Minimal re-renders (React.memo not needed due to stable props)
- Lazy loading of images
- Efficient list rendering with keys
- Type-safe API boundaries

## Testing

See `docs/TESTING_SOLITO_PRODUCTS.md` for:

- Manual testing procedures
- Deep linking testing (iOS/Android)
- API endpoint testing
- Error scenario testing

## Future Enhancements

- [ ] Add product search functionality
- [ ] Add category filtering
- [ ] Add sort options (price, date, etc.)
- [ ] Add pagination for large product lists
- [ ] Add favourites/saved products
- [ ] Add product comparison
- [ ] Add image zoom/carousel
- [ ] Add reviews and ratings
- [ ] Add similar products section
