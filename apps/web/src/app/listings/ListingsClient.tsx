"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Column, Row, Text, Button, Badge } from "@buttergolf/ui";
import { useMedia } from "tamagui";
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

export function ListingsClient({
  initialProducts,
  initialTotal,
  initialFilters,
  initialPage,
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
            showFavoritesOnly: searchParams.get("favorites") === "true" || parsed.showFavoritesOnly || false,
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
      showFavoritesOnly: searchParams.get("favorites") === "true" || false,
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
  const media = useMedia();

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
      if (newFilters.showFavoritesOnly) params.set("favorites", "true");
      if (newSort !== "newest") params.set("sort", newSort);
      if (newPage > 1) params.set("page", newPage.toString());

      return `/listings?${params.toString()}`;
    },
    [initialFilters.priceRange]
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
        filters.conditions.forEach((c) => params.append("condition", c));
        if (filters.minPrice) params.set("minPrice", filters.minPrice.toString());
        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString());
        filters.brands.forEach((b) => params.append("brand", b));
        if (filters.showFavoritesOnly) params.set("favorites", "true");
        params.set("sort", sort);
        params.set("page", newPage.toString());
        params.set("limit", "24");

        const response = await fetch(`/api/listings?${params.toString()}`);
        const data = await response.json();

        setProducts(data.products);
        setTotal(data.total);
        setPage(newPage);
        setAvailableFilters(data.filters);

        // Update URL
        router.push(buildURL(filters, sort, newPage), { scroll: false });

        // Scroll to top of page smoothly
        window.scrollTo({ top: 0, behavior: "smooth" });
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
      fetchProducts(1);
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort]);

  // Redirect to last valid page if current page exceeds total pages
  useEffect(() => {
    if (!isLoading && totalPages > 0 && page > totalPages) {
      fetchProducts(totalPages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, totalPages, isLoading]);

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
      showFavoritesOnly: false,
    };
    setFilters(defaultFilters);
    if (typeof window !== "undefined") {
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
    <Column width="100%">
      {/* Page Hero - Top section */}
      <Column width="100%" backgroundColor="$surface">
        <PageHero />
      </Column>

      {/* Listings Content - Main section */}
      <Column width="100%" backgroundColor="$background" paddingVertical="$lg" minHeight="60vh">
        <Column
          maxWidth={1280}
          marginHorizontal="auto"
          paddingHorizontal="$xl"
          width="100%"
          gap="$lg"
        >
          {/* Header */}
          <Row
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap="$md"
            width="100%"
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
              {/* Mobile filter button - show only on mobile/tablet */}
              {!media.gtMd && (
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
              )}

              {/* Sort dropdown */}
              <SortDropdown value={sort} onChange={setSort} />
            </Row>
          </Row>

          {/* Active filters chips */}
          {activeFilterCount > 0 && (
            <Row gap="$sm" flexWrap="wrap" alignItems="center" width="100%">
              <Text size="$3" color="$textSecondary">
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
              <Button size="$4" chromeless onPress={handleClearAll}>
                Clear all
              </Button>
            </Row>
          )}

          {/* Main content: Sidebar + Grid */}
          <Row gap="$2xl" alignItems="flex-start" width="100%">
            {/* Desktop sidebar */}
            <FilterSidebar
              filters={filters}
              availableBrands={availableFilters?.availableBrands || []}
              priceRange={availableFilters?.priceRange || { min: 0, max: 10000 }}
              onChange={handleFilterChange}
              onClearAll={handleClearAll}
            />

            {/* Products grid */}
            <Column flex={1} minWidth={0}>
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

      {/* Trust & Newsletter Sections - Bottom sections */}
      <Column width="100%">
        <TrustSection />
        <NewsletterSection />
      </Column>

      {/* Footer - Bottom section */}
      <Column width="100%">
        <FooterSection />
      </Column>
    </Column>
  );
}
