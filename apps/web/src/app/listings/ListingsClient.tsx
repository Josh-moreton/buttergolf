"use client";

import { useState, useEffect, useCallback, useMemo, useRef, startTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Column, Row, Text, Button, Badge } from "@buttergolf/ui";
import type { ProductCardData } from "@buttergolf/app";
import { FilterSidebar, type FilterState } from "./_components/FilterSidebar";
import { MobileFilterSheet } from "./_components/MobileFilterSheet";
import { SortDropdown } from "./_components/SortDropdown";
import { ProductsGrid } from "./_components/ProductsGrid";
import { PageHero } from "../_components/marketplace/PageHero";
import { TrustSection } from "../_components/marketplace/TrustSection";
import { NewsletterSection } from "../_components/marketplace/NewsletterSection";
import { FooterSection } from "../_components/marketplace/FooterSection";

interface ListingsClientProps {
  initialProducts: ProductCardData[];
  initialTotal: number;
  initialFilters: {
    availableBrands: string[];
    priceRange: { min: number; max: number };
  };
  initialPage: number;
}

const STORAGE_KEY = "buttergolf-listings-filters";

function areStringArraysEqual(a: readonly string[], b: readonly string[]) {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function areFiltersEqual(a: FilterState | undefined, b: FilterState) {
  if (!a) return false;
  return (
    a.category === b.category &&
    a.minPrice === b.minPrice &&
    a.maxPrice === b.maxPrice &&
    a.showFavouritesOnly === b.showFavouritesOnly &&
    areStringArraysEqual(a.conditions, b.conditions) &&
    areStringArraysEqual(a.brands, b.brands)
  );
}

export function ListingsClient({
  initialProducts,
  initialTotal,
  initialFilters,
  initialPage,
}: Readonly<ListingsClientProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse initial filters from URL
  const getInitialFilters = (): FilterState => {
    // Try to load from localStorage first
    if (globalThis.window !== undefined) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Merge URL params (they take precedence)
          return {
            category: searchParams.get("category") || parsed.category || null,
            conditions:
              searchParams.getAll("condition") || parsed.conditions || [],
            minPrice:
              Number.parseFloat(searchParams.get("minPrice") || "") ||
              parsed.minPrice ||
              initialFilters.priceRange.min,
            maxPrice:
              Number.parseFloat(searchParams.get("maxPrice") || "") ||
              parsed.maxPrice ||
              initialFilters.priceRange.max,
            brands: searchParams.getAll("brand") || parsed.brands || [],
            showFavouritesOnly:
              searchParams.get("favourites") === "true" ||
              parsed.showFavouritesOnly ||
              false,
          };
        } catch {
          // Fall through to URL parsing
        }
      }
    }

    // Parse from URL
    return {
      category: searchParams.get("category") || null,
      conditions: searchParams.getAll("condition") || [],
      minPrice:
        Number.parseFloat(searchParams.get("minPrice") || "") ||
        initialFilters.priceRange.min,
      maxPrice:
        Number.parseFloat(searchParams.get("maxPrice") || "") ||
        initialFilters.priceRange.max,
      brands: searchParams.getAll("brand") || [],
      showFavouritesOnly: searchParams.get("favourites") === "true" || false,
    };
  };

  const [filters, setFilters] = useState<FilterState>(getInitialFilters());
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [products, setProducts] = useState<ProductCardData[]>(initialProducts);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(initialTotal);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [availableFilters, setAvailableFilters] = useState(initialFilters);

  // Track if component has mounted to prevent initial fetch
  const [isMounted, setIsMounted] = useState(false);

  // Track previous filter values to detect actual changes
  const prevFiltersRef = useRef<FilterState>(filters);
  const prevSortRef = useRef<string>(sort);

  // Set mounted flag on initial mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Save filters to localStorage
  useEffect(() => {
    if (globalThis.window !== undefined) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    }
  }, [filters]);

  // Build URL from filters
  const buildURL = useCallback(
    (newFilters: FilterState, newSort: string, newPage: number = 1) => {
      const params = new URLSearchParams();

      if (newFilters.category) params.set("category", newFilters.category);
      for (const c of newFilters.conditions) {
        params.append("condition", c);
      }
      if (newFilters.minPrice !== initialFilters.priceRange.min) {
        params.set("minPrice", newFilters.minPrice.toString());
      }
      if (newFilters.maxPrice !== initialFilters.priceRange.max) {
        params.set("maxPrice", newFilters.maxPrice.toString());
      }
      for (const b of newFilters.brands) {
        params.append("brand", b);
      }
      if (newFilters.showFavouritesOnly) params.set("favourites", "true");
      if (newSort !== "newest") params.set("sort", newSort);
      if (newPage > 1) params.set("page", newPage.toString());

      return `/listings?${params.toString()}`;
    },
    [initialFilters.priceRange],
  );

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(total / 24));

  // Fetch products with debouncing
  const fetchProducts = useCallback(
    async (newPage: number = 1) => {
      setIsLoading(true);

      try {
        const params = new URLSearchParams();
        if (filters.category) params.set("category", filters.category);
        for (const c of filters.conditions) {
          params.append("condition", c);
        }
        if (filters.minPrice)
          params.set("minPrice", filters.minPrice.toString());
        if (filters.maxPrice)
          params.set("maxPrice", filters.maxPrice.toString());
        for (const b of filters.brands) {
          params.append("brand", b);
        }
        if (filters.showFavouritesOnly) params.set("favourites", "true");
        params.set("sort", sort);
        params.set("page", newPage.toString());
        params.set("limit", "24");

        const response = await fetch(`/api/listings?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch listings: ${response.status}`);
        }
        const data = await response.json();

        // Batch non-urgent data updates together using startTransition
        startTransition(() => {
          setProducts(data.products);
          setTotal(data.total);
          setPage(newPage);
          setAvailableFilters(data.filters);
        });

        // Only update the URL once we have successfully updated the data.
        router.replace(buildURL(filters, sort, newPage), { scroll: false });

        // Scroll to top of page smoothly
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        // Loading state should update synchronously for immediate feedback.
        setIsLoading(false);
      }
    },
    [filters, sort, router, buildURL],
  );

  // Debounced fetch on filter change
  useEffect(() => {
    // Skip on initial mount - we already have server-rendered data
    if (!isMounted) return;

    // Check if filters or sort actually changed
    const filtersChanged = !areFiltersEqual(prevFiltersRef.current, filters);
    const sortChanged = prevSortRef.current !== sort;

    if (!filtersChanged && !sortChanged) {
      return;
    }

    // Update refs
    prevFiltersRef.current = filters;
    prevSortRef.current = sort;

    // Debounce the fetch to avoid excessive requests
    const timeoutId = setTimeout(() => {
      fetchProducts(1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, sort, isMounted, fetchProducts]);

  // Redirect to last valid page if current page exceeds total pages
  useEffect(() => {
    // Skip on initial mount
    if (!isMounted) return;

    if (!isLoading && totalPages > 0 && page > totalPages) {
      fetchProducts(totalPages);
    }
  }, [page, totalPages, isLoading, isMounted, fetchProducts]);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Clear all filters
  const handleClearAll = () => {
    const defaultFilters: FilterState = {
      category: null,
      conditions: [],
      minPrice: initialFilters.priceRange.min,
      maxPrice: initialFilters.priceRange.max,
      brands: [],
      showFavouritesOnly: false,
    };
    setFilters(defaultFilters);
    if (globalThis.window !== undefined) {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && !isLoading) {
      fetchProducts(newPage);
    }
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.conditions.length > 0) count += filters.conditions.length;
    if (filters.brands.length > 0) count += filters.brands.length;
    if (
      filters.minPrice !== initialFilters.priceRange.min ||
      filters.maxPrice !== initialFilters.priceRange.max
    ) {
      count++;
    }
    return count;
  }, [filters, initialFilters.priceRange]);

  return (
    <Column width="100%" backgroundColor="$surface">
      {/* Page Hero */}
      <PageHero />

      {/* Listings Content */}
      <Column width="100%" paddingVertical="$lg">
        <Column
          maxWidth={1280}
          marginHorizontal="auto"
          paddingHorizontal="$md"
          $gtSm={{ paddingHorizontal: "$lg" }}
          $gtMd={{ paddingHorizontal: "$xl" }}
          $gtLg={{ paddingHorizontal: "$2xl" }}
          width="100%"
          gap="$lg"
        >
          {/* Header */}
          <Row
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap="$md"
          >
            <Column gap="$xs">
              <Text size="$9" weight="bold">
                Shop All Products
              </Text>
              <Text color="$textSecondary">
                {total} {total === 1 ? "product" : "products"} found
              </Text>
            </Column>

            <Row gap="$md" alignItems="center">
              {/* Mobile filter button */}
              <Row display="flex" $gtLg={{ display: "none" }}>
                <Button
                  size="$4"
                  chromeless
                  onPress={() => setMobileFilterOpen(true)}
                >
                  <Row gap="$sm" alignItems="center">
                    <Text>Filters</Text>
                    {activeFilterCount > 0 && (
                      <Badge variant="primary" size="sm">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Row>
                </Button>
              </Row>

              {/* Sort dropdown */}
              <SortDropdown value={sort} onChange={setSort} />
            </Row>
          </Row>

          {/* Active filters chips */}
          {activeFilterCount > 0 && (
            <Row gap="$sm" flexWrap="wrap" alignItems="center">
              <Text size="$3" color="$textSecondary">
                Active filters:
              </Text>
              {filters.category && (
                <Badge variant="outline" size="md">
                  <Row gap="$2" alignItems="center">
                    <Text>{filters.category}</Text>
                    <Button
                      size="$2"
                      chromeless
                      padding="$0"
                      onPress={() => handleFilterChange({ category: null })}
                      aria-label="Remove category filter"
                    >
                      <Text>×</Text>
                    </Button>
                  </Row>
                </Badge>
              )}
              {filters.conditions.map((condition) => (
                <Badge key={condition} variant="outline" size="md">
                  <Row gap="$2" alignItems="center">
                    <Text>{condition.replace("_", " ")}</Text>
                    <Button
                      size="$2"
                      chromeless
                      padding="$0"
                      onPress={() =>
                        handleFilterChange({
                          conditions: filters.conditions.filter(
                            (c) => c !== condition,
                          ),
                        })
                      }
                      aria-label={`Remove ${condition} filter`}
                    >
                      <Text>×</Text>
                    </Button>
                  </Row>
                </Badge>
              ))}
              {filters.brands.map((brand) => (
                <Badge key={brand} variant="outline" size="md">
                  <Row gap="$2" alignItems="center">
                    <Text>{brand}</Text>
                    <Button
                      size="$2"
                      chromeless
                      padding="$0"
                      onPress={() =>
                        handleFilterChange({
                          brands: filters.brands.filter((b) => b !== brand),
                        })
                      }
                      aria-label={`Remove ${brand} filter`}
                    >
                      <Text>×</Text>
                    </Button>
                  </Row>
                </Badge>
              ))}
              <Button size="$4" chromeless onPress={handleClearAll}>
                Clear all
              </Button>
            </Row>
          )}

          {/* Main content: Sidebar + Grid */}
          <Row gap="$2xl" alignItems="flex-start" overflow="hidden" width="100%">
            {/* Desktop sidebar */}
            <FilterSidebar
              filters={filters}
              availableBrands={availableFilters?.availableBrands || []}
              priceRange={
                availableFilters?.priceRange || { min: 0, max: 10000 }
              }
              onChange={handleFilterChange}
              onClearAll={handleClearAll}
            />

            {/* Products grid */}
            <Column flex={1}>
              <ProductsGrid
                products={products}
                isLoading={isLoading}
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </Column>
          </Row>
        </Column>

        {/* Mobile filter sheet */}
        <MobileFilterSheet
          open={mobileFilterOpen}
          onOpenChange={setMobileFilterOpen}
          filters={filters}
          availableBrands={availableFilters?.availableBrands || []}
          priceRange={availableFilters?.priceRange || { min: 0, max: 10000 }}
          onChange={handleFilterChange}
          onClearAll={handleClearAll}
          onApply={() => fetchProducts(1)}
        />
      </Column>

      {/* Trust & Newsletter Sections */}
      <TrustSection />
      <NewsletterSection />

      {/* Footer */}
      <FooterSection />
    </Column>
  );
}
