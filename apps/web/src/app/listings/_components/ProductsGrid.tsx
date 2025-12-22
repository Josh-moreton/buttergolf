"use client";

import { useState, useEffect, useRef } from "react";
import { Column, Row, View, Text } from "@buttergolf/ui";
import { ProductCard } from "@/components/ProductCard";
import type { ProductCardData } from "@buttergolf/app";
import { useRouter } from "next/navigation";

interface ProductsGridProps {
  readonly products: ProductCardData[];
  readonly isLoading: boolean;
  readonly isPaginating?: boolean; // When paginating, keep products visible with fade transition
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
}

function LoadingSkeleton() {
  return (
    <Column
      width="100%"
      paddingBottom="111.11%"
      backgroundColor="$border"
      borderRadius="$lg"
      position="relative"
      overflow="hidden"
      animation="quick"
    />
  );
}

/**
 * Dot-based pagination component
 * - Shows dots for each page
 * - Currently selected page has an elongated pill shape
 * - Smooth animation between circle and pill states
 */
function DotPagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: Readonly<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}>) {
  // For many pages, show limited dots with the active one in context
  const getVisiblePages = (): number[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Show: first, ..., current-1, current, current+1, ..., last
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <Row
      alignItems="center"
      justifyContent="center"
      gap="$sm"
      paddingVertical="$xl"
    >
      {visiblePages.map((page) => {
        const isActive = page === currentPage;

        return (
          <View
            key={page}
            role="button"
            aria-label={`Go to page ${page}`}
            aria-current={isActive ? "page" : undefined}
            aria-disabled={disabled}
            onPress={() => !disabled && onPageChange(page)}
            cursor={disabled ? "wait" : "pointer"}
            opacity={disabled && !isActive ? 0.5 : 1}
            // Animate dimensions: circle (12x12) to pill (32x12)
            width={isActive ? 32 : 12}
            height={12}
            borderRadius={6}
            backgroundColor={isActive ? "$primary" : "$border"}
            // Smooth spring animation for width transition
            animation="medium"
            hoverStyle={disabled ? {} : {
              backgroundColor: isActive ? "$primary" : "$textSecondary",
              scale: isActive ? 1 : 1.2,
            }}
            pressStyle={disabled ? {} : {
              scale: 0.95,
            }}
          />
        );
      })}
    </Row>
  );
}

/**
 * Animated wrapper for grid content with fade/slide transitions
 */
function AnimatedGridContent({
  products,
  isLoading,
  isPaginating,
  currentPage,
}: Readonly<{
  products: ProductCardData[];
  isLoading: boolean;
  isPaginating: boolean;
  currentPage: number;
}>) {
  const router = useRouter();
  const [displayProducts, setDisplayProducts] = useState(products);
  const prevPageRef = useRef(currentPage);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle page transitions with animation
  useEffect(() => {
    // When paginating (not loading), animate the transition
    if (isPaginating && prevPageRef.current !== currentPage) {
      // Determine slide direction based on page change
      setSlideDirection(currentPage > prevPageRef.current ? "left" : "right");
      setIsAnimating(true);
      prevPageRef.current = currentPage;
    }
  }, [isPaginating, currentPage]);

  // When we get new products and we're done paginating, fade them in
  useEffect(() => {
    if (!isPaginating && !isLoading && products !== displayProducts) {
      // Small delay to allow exit animation
      const timer = setTimeout(() => {
        setDisplayProducts(products);
        setIsAnimating(false);
      }, isAnimating ? 200 : 0);
      return () => clearTimeout(timer);
    }
  }, [products, isPaginating, isLoading, displayProducts, isAnimating]);

  // Show loading skeletons only for full loading (filter changes), not pagination
  if (isLoading) {
    return (
      <>
        {Array.from({ length: 24 }, (_, i) => (
          <LoadingSkeleton key={`loading-skeleton-${i}`} />
        ))}
      </>
    );
  }

  // During pagination, show current products with fade effect
  const productsToShow = isPaginating ? displayProducts : products;

  return (
    <>
      {productsToShow.map((product, index) => (
        <View
          key={product.id}
          style={{
            opacity: isPaginating || isAnimating ? 0.5 : 1,
            transform: isPaginating 
              ? slideDirection === "left" 
                ? "translateX(-8px)" 
                : "translateX(8px)"
              : "translateX(0)",
            transition: "opacity 200ms ease-out, transform 200ms ease-out",
            transitionDelay: `${Math.min(index * 8, 150)}ms`,
          }}
        >
          <ProductCard
            product={product}
            onPress={() => router.push(`/products/${product.id}`)}
          />
        </View>
      ))}
    </>
  );
}

export function ProductsGrid({
  products,
  isLoading,
  isPaginating = false,
  currentPage,
  totalPages,
  onPageChange,
}: Readonly<ProductsGridProps>) {
  if (!isLoading && !isPaginating && products.length === 0) {
    return (
      <Column
        alignItems="center"
        justifyContent="center"
        paddingVertical="$10"
        gap="$md"
      >
        <Text size="$7" weight="semibold" color="$textSecondary">
          No products found
        </Text>
        <Text color="$textMuted">
          Try adjusting your filters or search query
        </Text>
      </Column>
    );
  }

  return (
    <Column gap="$lg" width="100%">
      {/* Products Grid - Responsive: 2 col mobile, 3 col tablet+ */}
      {/* Extra padding + negative margin allows shadows to overflow without clipping */}
      <Column
        width="100%"
        style={{ display: "grid", overflow: "visible" }}
        gridTemplateColumns="repeat(2, 1fr)"
        gap="$6"
        padding="$4"
        margin="$-4"
        $gtSm={{
          gridTemplateColumns: "repeat(3, 1fr)",
        }}
      >
        <AnimatedGridContent
          products={products}
          isLoading={isLoading}
          isPaginating={isPaginating}
          currentPage={currentPage}
        />
      </Column>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <DotPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          disabled={isPaginating}
        />
      )}
    </Column>
  );
}
