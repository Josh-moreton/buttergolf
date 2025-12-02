# Plan: Product Listing Page with Advanced Filters

Create a comprehensive product listing/shop page at `/listings` with a left-hand filter sidebar (desktop) and mobile filter sheet, supporting category, price range, condition, brand filtering, sorting options, and pagination. The page will use Next.js App Router with URL-based filter state for shareable links.

### Steps

1. **Create listings API endpoint** at `apps/web/src/app/api/listings/route.ts` that accepts query params (category, condition[], minPrice, maxPrice, brand[], sort, page, limit), builds Prisma where clause with dynamic filters, implements pagination with skip/take, returns products with total count and available filter options (brands list, price range)

2. **Create filter UI components** in `apps/web/src/app/listings/_components/`: `FilterSection.tsx` (collapsible group with title), `CategoryFilter.tsx` (category chips/list), `ConditionFilter.tsx` (checkboxes using native HTML + Tamagui styling), `PriceRangeFilter.tsx` (two Input components for min/max), `BrandFilter.tsx` (checkbox list with search), `SortDropdown.tsx` (native select styled with Tamagui)

3. **Build FilterSidebar component** at `apps/web/src/app/listings/_components/FilterSidebar.tsx` for desktop - fixed Column width 280px, sticky positioning, contains all filter sections (Category, Condition, Price, Brand), "Clear All" button at bottom, uses `$background` color with `$border`

4. **Build MobileFilterSheet component** at `apps/web/src/app/listings/_components/MobileFilterSheet.tsx` - full-screen overlay triggered by "Filters" button, contains same filter sections as sidebar, "Apply Filters" and "Clear All" buttons at bottom, filter count badge on trigger button

5. **Create ProductsGrid component** at `apps/web/src/app/listings/_components/ProductsGrid.tsx` displaying products in CSS grid `repeat(auto-fill, minmax(280px, 1fr))`, includes loading skeleton states, empty state with "No products found" message, uses existing `ProductCard` component, implements pagination controls at bottom

6. **Build main ListingsClient component** at `apps/web/src/app/listings/ListingsClient.tsx` managing filter state from URL with `useSearchParams` and `useRouter`, fetching products on filter change with debouncing, coordinating FilterSidebar (desktop) and MobileFilterSheet (mobile), showing active filters as removable chips, rendering ProductsGrid with results

7. **Create listings page** at page.tsx as Server Component using `searchParams` prop to get initial filters, fetching initial products server-side, passing data to ListingsClient, rendering layout with header (title, result count, sort dropdown) and two-column layout (sidebar + grid)

8. **Update CategoryGrid links** in CategoryGrid.tsx to properly link to `/listings?category={slug}`, update "View all" button in RecentlyListedSection to link to `/listings`

### Further Considerations

1. **Checkbox component**: Create native HTML checkbox styled with Tamagui tokens (`borderColor="$border"`, `backgroundColor="$primary"` when checked), or build full Tamagui component for reusability?

2. **Mobile filter UX**: Use bottom sheet that slides up from bottom (iOS-style) vs full-screen overlay (current mobile menu style) - which feels better for filtering?

3. **Pagination style**: Classic numbered pagination (1, 2, 3...) vs "Load More" button vs infinite scroll - which provides best UX for browsing products?

4. **Filter persistence**: Store filter preferences in localStorage for returning users, or keep stateless with URL-only state?

5. **Sort options**: Include basic options (Newest, Price Low-High, Price High-Low) or add advanced (Most Popular, Best Match) requiring additional database fields (views, favorites)?

6. **Price range**: Use two text inputs for min/max or implement proper range slider component with draggable handles for better UX?

## Answers to Further Considerations

1. lets build full tamagui for reusability
2. yes use a bottom sheet for mobile only
3. infinite scroll
4. store filter preference in localstorage
5. yes add sort options, and add database fields where needed
6. implment proper slider for better UX
