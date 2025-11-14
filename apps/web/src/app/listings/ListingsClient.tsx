"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Column, Row, Text, Button, Badge } from "@buttergolf/ui";
import type { ProductCardData } from "@buttergolf/app";
import { FilterSidebar, type FilterState } from "./_components/FilterSidebar";
import { MobileFilterSheet } from "./_components/MobileFilterSheet";
import { SortDropdown } from "./_components/SortDropdown";
import { ProductsGrid } from "./_components/ProductsGrid";
import { PageHero } from "../_components/marketplace/PageHero";
import { FooterSection } from "../_components/marketplace/FooterSection";

interface ListingsClientProps {
  initialProducts: ProductCardData[];
  initialTotal: number;
  initialFilters: {
    availableBrands: string[];
    priceRange: { min: number; max: number };
  };
  initialPage: number;
  initialHasMore: boolean;
}

const STORAGE_KEY = "buttergolf-listings-filters";

export function ListingsClient({
  initialProducts,
  initialTotal,
  initialFilters,
  initialPage,
  initialHasMore,
}: ListingsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse initial filters from URL
  const getInitialFilters = (): FilterState => {
    // Try to load from localStorage first
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Merge URL params (they take precedence)
          return {
            category: searchParams.get("category") || parsed.category || null,
            conditions: searchParams.getAll("condition") || parsed.conditions || [],
            minPrice: parseFloat(searchParams.get("minPrice") || "") || parsed.minPrice || initialFilters.priceRange.min,
            maxPrice: parseFloat(searchParams.get("maxPrice") || "") || parsed.maxPrice || initialFilters.priceRange.max,
            brands: searchParams.getAll("brand") || parsed.brands || [],
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
      minPrice: parseFloat(searchParams.get("minPrice") || "") || initialFilters.priceRange.min,
      maxPrice: parseFloat(searchParams.get("maxPrice") || "") || initialFilters.priceRange.max,
      brands: searchParams.getAll("brand") || [],
    };
  };

  const [filters, setFilters] = useState<FilterState>(getInitialFilters());
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(initialTotal);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [availableFilters, setAvailableFilters] = useState(initialFilters);

  // Save filters to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    }
  }, [filters]);

  // Build URL from filters
  const buildURL = useCallback(
    (newFilters: FilterState, newSort: string, newPage: number = 1) => {
      const params = new URLSearchParams();

      if (newFilters.category) params.set("category", newFilters.category);
      newFilters.conditions.forEach((c) => params.append("condition", c));
      if (newFilters.minPrice !== initialFilters.priceRange.min) {
        params.set("minPrice", newFilters.minPrice.toString());
      }
      if (newFilters.maxPrice !== initialFilters.priceRange.max) {
        params.set("maxPrice", newFilters.maxPrice.toString());
      }
      newFilters.brands.forEach((b) => params.append("brand", b));
      if (newSort !== "newest") params.set("sort", newSort);
      if (newPage > 1) params.set("page", newPage.toString());

      return `/listings?${params.toString()}`;
    },
    [initialFilters.priceRange]
  );

  // Fetch products with debouncing
  const fetchProducts = useCallback(
    async (newPage: number = 1, append: boolean = false) => {
      setIsLoading(true);

      try {
        const params = new URLSearchParams();
        if (filters.category) params.set("category", filters.category);
        filters.conditions.forEach((c) => params.append("condition", c));
        if (filters.minPrice) params.set("minPrice", filters.minPrice.toString());
        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString());
        filters.brands.forEach((b) => params.append("brand", b));
        params.set("sort", sort);
        params.set("page", newPage.toString());
        params.set("limit", "24");

        const response = await fetch(`/api/listings?${params.toString()}`);
        const data = await response.json();

        if (append) {
          setProducts((prev) => [...prev, ...data.products]);
        } else {
          setProducts(data.products);
        }

        setTotal(data.total);
        setHasMore(data.hasMore);
        setPage(newPage);
        setAvailableFilters(data.filters);

        // Update URL
        router.push(buildURL(filters, sort, newPage), { scroll: false });
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [filters, sort, router, buildURL]
  );

  // Debounced fetch on filter change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts(1, false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, sort]);

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
    };
    setFilters(defaultFilters);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Load more for infinite scroll
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchProducts(page + 1, true);
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
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @media (min-width: 1024px) {
            .mobile-filter-button {
              display: none !important;
            }
            .desktop-filter-sidebar {
              display: flex !important;
            }
          }
        `,
          }}
        />
        <Column
          maxWidth={1280}
          marginHorizontal="auto"
          paddingHorizontal="$6"
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
              <Text fontSize="$9" weight="bold">
                Shop All Products
              </Text>
              <Text color="$textSecondary">
                {total} {total === 1 ? "product" : "products"} found
              </Text>
            </Column>

            <Row gap="$md" alignItems="center">
              {/* Mobile filter button */}
              <div
                style={{ display: "flex" }}
                className="mobile-filter-button"
              >
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
              </div>

              {/* Sort dropdown */}
              <SortDropdown value={sort} onChange={setSort} />
            </Row>
          </Row>

          {/* Active filters chips */}
          {activeFilterCount > 0 && (
            <Row gap="$sm" flexWrap="wrap" alignItems="center">
              <Text size="sm" color="$textSecondary">
                Active filters:
              </Text>
              {filters.category && (
                <Badge variant="outline" size="md">
                  {filters.category}
                  <span
                    style={{ marginLeft: 8, cursor: "pointer" }}
                    onClick={() => handleFilterChange({ category: null })}
                  >
                    ×
                  </span>
                </Badge>
              )}
              {filters.conditions.map((condition) => (
                <Badge key={condition} variant="outline" size="md">
                  {condition.replace("_", " ")}
                  <span
                    style={{ marginLeft: 8, cursor: "pointer" }}
                    onClick={() =>
                      handleFilterChange({
                        conditions: filters.conditions.filter((c) => c !== condition),
                      })
                    }
                  >
                    ×
                  </span>
                </Badge>
              ))}
              {filters.brands.map((brand) => (
                <Badge key={brand} variant="outline" size="md">
                  {brand}
                  <span
                    style={{ marginLeft: 8, cursor: "pointer" }}
                    onClick={() =>
                      handleFilterChange({
                        brands: filters.brands.filter((b) => b !== brand),
                      })
                    }
                  >
                    ×
                  </span>
                </Badge>
              ))}
              <Button size="$3" chromeless onPress={handleClearAll}>
                Clear all
              </Button>
            </Row>
          )}

          {/* Main content: Sidebar + Grid */}
          <Row gap="$lg" alignItems="flex-start">
            {/* Desktop sidebar */}
            <FilterSidebar
              filters={filters}
              availableBrands={availableFilters.availableBrands}
              priceRange={availableFilters.priceRange}
              onChange={handleFilterChange}
              onClearAll={handleClearAll}
            />

            {/* Products grid */}
            <Column flex={1}>
              <ProductsGrid
                products={products}
                hasMore={hasMore}
                isLoading={isLoading}
                onLoadMore={handleLoadMore}
              />
            </Column>
          </Row>
        </Column>

        {/* Mobile filter sheet */}
        <MobileFilterSheet
          open={mobileFilterOpen}
          onOpenChange={setMobileFilterOpen}
          filters={filters}
          availableBrands={availableFilters.availableBrands}
          priceRange={availableFilters.priceRange}
          onChange={handleFilterChange}
          onClearAll={handleClearAll}
          onApply={() => fetchProducts(1, false)}
        />
      </Column>

      {/* Footer */}
      <FooterSection />
    </Column>
  );
}
