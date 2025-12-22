"use client";

import { useState, useEffect, useRef } from "react";
import { Column, Row, View, Text } from "@buttergolf/ui";
import { ProductCard } from "@/components/ProductCard";
import type { ProductCardData } from "@buttergolf/app";
import { useRouter } from "next/navigation";

interface ProductsGridProps {
  readonly products: ProductCardData[];
  readonly isLoading: boolean;
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
}: Readonly<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
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
            onPress={() => onPageChange(page)}
            cursor="pointer"
            // Animate dimensions: circle (12x12) to pill (32x12)
            width={isActive ? 32 : 12}
            height={12}
            borderRadius={6}
            backgroundColor={isActive ? "$primary" : "$border"}
            // Smooth spring animation for width transition
            animation="medium"
            hoverStyle={{
              backgroundColor: isActive ? "$primary" : "$textSecondary",
              scale: isActive ? 1 : 1.2,
            }}
            pressStyle={{
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
  currentPage,
}: Readonly<{
  products: ProductCardData[];
  isLoading: boolean;
  currentPage: number;
}>) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayProducts, setDisplayProducts] = useState(products);
  const prevPageRef = useRef(currentPage);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");

  // Handle page transitions with animation
  useEffect(() => {
    if (prevPageRef.current !== currentPage && !isLoading) {
      // Determine slide direction based on page change
      setSlideDirection(currentPage > prevPageRef.current ? "left" : "right");
      setIsTransitioning(true);

      // After exit animation, update content
      const timer = setTimeout(() => {
        setDisplayProducts(products);
        prevPageRef.current = currentPage;
        setIsTransitioning(false);
      }, 150);

      return () => clearTimeout(timer);
    } else if (!isLoading) {
      setDisplayProducts(products);
    }
  }, [products, currentPage, isLoading]);

  // CSS for slide animation
  const slideTransform = isTransitioning
    ? slideDirection === "left"
      ? "translateX(-20px)"
      : "translateX(20px)"
    : "translateX(0)";

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 24 }, (_, i) => (
          <LoadingSkeleton key={`loading-skeleton-${i}`} />
        ))}
      </>
    );
  }

  return (
    <>
      {displayProducts.map((product, index) => (
        <View
          key={product.id}
          animation="quick"
          opacity={isTransitioning ? 0 : 1}
          style={{
            transform: slideTransform,
            transition: "opacity 150ms ease-out, transform 150ms ease-out",
            transitionDelay: `${index * 10}ms`,
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
  currentPage,
  totalPages,
  onPageChange,
}: Readonly<ProductsGridProps>) {
  if (!isLoading && products.length === 0) {
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
          currentPage={currentPage}
        />
      </Column>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <DotPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </Column>
  );
}
