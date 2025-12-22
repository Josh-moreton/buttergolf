"use client";

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

export function ProductsGrid({
  products,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}: Readonly<ProductsGridProps>) {
  const router = useRouter();

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
      <Column
        width="100%"
        style={{ display: "grid", overflow: "visible" }}
        gridTemplateColumns="repeat(2, 1fr)"
        gap="$6"
        padding="$2"
        margin="$-2"
        $gtSm={{
          gridTemplateColumns: "repeat(3, 1fr)",
        }}
      >
        {isLoading
          ? Array.from({ length: 24 }, (_, i) => (
              <LoadingSkeleton key={`loading-skeleton-${i}`} />
            ))
          : products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => router.push(`/products/${product.id}`)}
              />
            ))}
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
