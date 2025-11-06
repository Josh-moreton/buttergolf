# Testing Solito Product Routes and Deep Linking

This document provides step-by-step instructions for testing the Solito product routes integration and mobile deep linking functionality.

## Prerequisites

1. **Environment Setup**:
   - Web app running: `pnpm dev:web` (http://localhost:3000)
   - Mobile app built and installed on device/simulator
   - `.env` file in `apps/mobile/` with `EXPO_PUBLIC_API_URL` set

2. **Sample Data**:
   - Ensure database has at least one product
   - Note a product ID for testing (e.g., from `/api/products/recent`)

## Test 1: Products List Screen (Mobile)

### Objective
Verify the products list screen displays correctly and fetches data from the API.

### Steps
1. Open mobile app
2. Navigate to Products screen (if navigation added to UI)
3. Observe loading state
4. Verify products display correctly with:
   - Product image
   - Title
   - Price
   - Category
   - Condition badge

### Expected Results
- ✅ Products load from API
- ✅ Each product card is tappable
- ✅ Loading spinner shows while fetching
- ✅ Error message if API fails

## Test 2: Product Detail Screen (Mobile)

### Objective
Verify product detail screen displays full product information.

### Steps
1. From products list, tap a product card
2. Observe navigation to detail screen
3. Verify all product information displays:
   - Product images (primary + gallery)
   - Title and category
   - Condition badge
   - Price
   - Description
   - Seller information

### Expected Results
- ✅ Smooth navigation from list to detail
- ✅ All product data displays correctly
- ✅ "Back" button navigates to products list
- ✅ Images load properly

## Test 3: Cross-Platform Navigation with Solito

### Objective
Verify Solito routes work consistently across web and mobile.

### Steps

#### Web (Next.js)
1. Visit http://localhost:3000
2. Navigate to a product detail page (if links exist)
3. Note the URL format: `/products/[id]`

#### Mobile (Expo)
1. Use Solito link: `useLink({ href: '/products/123' })`
2. Verify it navigates to ProductDetail screen
3. Note route params are passed correctly

### Expected Results
- ✅ Same route paths work on both platforms
- ✅ Dynamic route params (`[id]`) work correctly
- ✅ Back navigation works as expected

## Test 4: Deep Linking (iOS)

### Objective
Verify Universal Links open the mobile app directly to product detail.

### Prerequisites
- iOS app installed on device/simulator
- App configured with Universal Links in `app.json`
- `.well-known/apple-app-site-association` file accessible at domain

### Steps

#### Option A: iOS Simulator
```bash
# Replace product ID with actual ID from database
xcrun simctl openurl booted "https://buttergolf.com/products/clq123456"
```

#### Option B: Physical Device
1. Send product link via Messages/Mail
2. Tap the link
3. Long-press link and verify "Open in ButterGolf" option appears

### Expected Results
- ✅ App opens (not Safari)
- ✅ App navigates directly to product detail screen
- ✅ Correct product data loads
- ✅ User is on ProductDetail screen, not Home screen

### Troubleshooting
- If Safari opens: Check Team ID in `apple-app-site-association`
- If Home screen shows: Check linking config in `App.tsx`
- If app doesn't open: Verify Universal Links in `app.json`

## Test 5: Deep Linking (Android)

### Objective
Verify App Links open the mobile app directly to product detail.

### Prerequisites
- Android app installed on device/emulator
- App configured with App Links in `app.json`
- `.well-known/assetlinks.json` file accessible at domain
- SHA256 fingerprint added to `assetlinks.json`

### Steps

#### Option A: Android Emulator
```bash
# Replace product ID with actual ID from database
adb shell am start -a android.intent.action.VIEW \
  -d "https://buttergolf.com/products/clq123456"
```

#### Option B: Physical Device
1. Send product link via email/messaging app
2. Tap the link
3. Verify "Open with ButterGolf" dialog appears

### Expected Results
- ✅ App opens (not Chrome)
- ✅ App navigates directly to product detail screen
- ✅ Correct product data loads
- ✅ User is on ProductDetail screen, not Home screen

### Troubleshooting
- If Chrome opens: Check SHA256 fingerprint in `assetlinks.json`
- If Home screen shows: Check linking config in `App.tsx`
- If app doesn't open: Verify intent filters in `app.json`
- Check App Links verification: `adb shell dumpsys package d` (look for domain verification)

## Test 6: ISR Sitemap Caching

### Objective
Verify sitemap uses ISR caching correctly.

### Steps

#### Initial Request
1. Visit http://localhost:3000/server-sitemap.xml
2. Note the products listed
3. Record the timestamp/response time

#### After Cache Period
1. Wait 6+ hours (or modify revalidate time for testing)
2. Add a new product to database
3. Visit http://localhost:3000/server-sitemap.xml again
4. Verify new product appears in sitemap

#### Production Test
1. Deploy to production
2. Check response headers for caching info
3. Verify sitemap updates within 6 hours of product changes

### Expected Results
- ✅ First request generates sitemap
- ✅ Subsequent requests within 6 hours serve cached version
- ✅ After 6 hours, sitemap regenerates in background
- ✅ New products appear in sitemap after revalidation
- ✅ Database queries are minimized (check logs)

### Performance Metrics
- Initial generation: ~200-500ms (depends on product count)
- Cached response: ~10-50ms
- Background revalidation: Transparent to users

## Test 7: Product JSON-LD Structured Data

### Objective
Verify product pages have correct JSON-LD for search engines.

### Steps
1. Open product detail page in browser
2. View page source (Ctrl+U or Cmd+Option+U)
3. Search for `application/ld+json`
4. Verify Product schema is present

### Expected Fields
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "...",
  "description": "...",
  "image": [...],
  "brand": {...},
  "model": "...",
  "offers": {
    "@type": "Offer",
    "price": "...",
    "priceCurrency": "GBP",
    "availability": "...",
    "itemCondition": "..."
  }
}
```

### Validation
1. Copy JSON-LD from page source
2. Visit [Google Rich Results Test](https://search.google.com/test/rich-results)
3. Paste JSON-LD
4. Verify no errors

### Expected Results
- ✅ JSON-LD is present in page source
- ✅ All required Product schema fields are populated
- ✅ Google Rich Results Test shows no errors
- ✅ Preview shows product information correctly

## Test 8: API Endpoints

### Objective
Verify API endpoints work correctly for mobile app.

### Endpoints to Test

#### 1. Recent Products
```bash
curl http://localhost:3000/api/products/recent
```

Expected: Array of recent products with ProductCardData format

#### 2. Single Product
```bash
curl http://localhost:3000/api/products/[PRODUCT_ID]
```

Expected: Full Product object with all fields

### Expected Results
- ✅ Both endpoints return 200 status
- ✅ Data format matches TypeScript interfaces
- ✅ Images URLs are absolute (include domain)
- ✅ Error handling works for invalid IDs

## Test 9: Error Handling

### Objective
Verify graceful error handling in all scenarios.

### Scenarios

#### 1. Invalid Product ID
- Navigate to `/products/invalid-id`
- Expected: Error message, not crash

#### 2. Network Failure
- Disable network on mobile device
- Try loading products
- Expected: Error message, retry option

#### 3. API Down
- Stop web server
- Try loading products in mobile app
- Expected: Graceful error message

#### 4. Missing Product
- Use ID of deleted product
- Expected: "Product not found" message

### Expected Results
- ✅ No app crashes
- ✅ Clear error messages
- ✅ User can navigate back/retry
- ✅ Loading states clear on error

## Automated Testing

### Future Enhancements
Consider adding these automated tests:

```typescript
// Example: Sitemap validation test
describe('Server Sitemap', () => {
  it('returns valid XML', async () => {
    const response = await fetch('http://localhost:3000/server-sitemap.xml');
    expect(response.headers.get('content-type')).toContain('xml');
    const text = await response.text();
    expect(text).toContain('<?xml version="1.0"');
    expect(text).toContain('<urlset');
  });

  it('includes product URLs', async () => {
    const response = await fetch('http://localhost:3000/server-sitemap.xml');
    const text = await response.text();
    expect(text).toContain('/products/');
  });
});
```

## Checklist Summary

Before marking tasks complete, verify:

- [ ] Products list screen loads and displays products
- [ ] Product detail screen shows full information
- [ ] Solito navigation works on both platforms
- [ ] iOS deep linking opens app to correct screen
- [ ] Android deep linking opens app to correct screen
- [ ] Sitemap uses ISR caching (6-hour revalidation)
- [ ] Product JSON-LD validates with Google tool
- [ ] API endpoints return correct data
- [ ] Error handling works gracefully
- [ ] Performance is acceptable (< 1s for screen loads)

## Known Limitations

1. **Physical Device Testing**: Deep linking requires physical devices for full testing (simulators have limitations)
2. **Production Domain**: Universal/App Links only work with HTTPS production domain
3. **Team ID**: iOS Universal Links require valid Apple Team ID
4. **SHA256 Fingerprint**: Android App Links require signing key fingerprint

## Resources

- [Solito Documentation](https://solito.dev)
- [React Navigation Deep Linking](https://reactnavigation.org/docs/deep-linking/)
- [Apple Universal Links](https://developer.apple.com/ios/universal-links/)
- [Android App Links](https://developer.android.com/training/app-links)
- [Next.js ISR](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
