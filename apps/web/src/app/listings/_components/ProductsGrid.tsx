"use client";

import { Button, Column, Row, Text } from "@buttergolf/ui";
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

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Readonly<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}>) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Row
      alignItems="center"
      justifyContent="center"
      gap="$sm"
      paddingVertical="$lg"
    >
      {/* Previous arrow */}
      <Button
        chromeless
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        width={40}
        height={40}
        alignItems="center"
        justifyContent="center"
        opacity={currentPage === 1 ? 0.4 : 1}
        cursor={currentPage === 1 ? "not-allowed" : "pointer"}
      >
        <Text size="$8" color="$primary">
          ‹
        </Text>
      </Button>

      {/* Page numbers */}
      {getPageNumbers().map((page, index) => {
        if (page === "...") {
          return (
            <Text
              key={`ellipsis-${currentPage}-${index}`}
              paddingHorizontal="$2"
              color="$textSecondary"
            >
              …
            </Text>
          );
        }

        const isActive = page === currentPage;
        return (
          <Button
            key={page}
            chromeless
            onPress={() => onPageChange(page as number)}
            minWidth={40}
            height={40}
            paddingHorizontal="$3"
            alignItems="center"
            justifyContent="center"
          >
            <Text
              size="$6"
              fontWeight={isActive ? "600" : "400"}
              color={isActive ? "$primary" : "$text"}
              textDecorationLine={isActive ? "underline" : "none"}
            >
              {page}
            </Text>
          </Button>
        );
      })}

      {/* Next arrow */}
      <Button
        chromeless
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        width={40}
        height={40}
        alignItems="center"
        justifyContent="center"
        opacity={currentPage === totalPages ? 0.4 : 1}
        cursor={currentPage === totalPages ? "not-allowed" : "pointer"}
      >
        <Text size="$8" color="$primary">
          ›
        </Text>
      </Button>
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
        overflow="hidden"
        style={{ display: "grid" }}
        gridTemplateColumns="repeat(2, 1fr)"
        gap="$6"
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </Column>
  );
}
