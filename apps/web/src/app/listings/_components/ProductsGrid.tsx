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
    <div
      style={{
        width: "100%",
        paddingBottom: "111.11%", // 9:10 aspect ratio
        backgroundColor: "#f0f0f0",
        borderRadius: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
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
            <span
              key={`ellipsis-${index}`}
              style={{
                padding: "0 8px",
                color: "#545454",
                fontFamily: "var(--font-urbanist)",
              }}
            >
              …
            </span>
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
      {/* Products Grid - Responsive: 1 col mobile, 2 col tablet, 3 col desktop */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(1, 1fr)",
          gap: "24px",
          width: "100%",
        }}
        className="products-grid"
      >
        {isLoading
          ? Array.from({ length: 24 }).map((_, i) => (
            <LoadingSkeleton key={`skeleton-${i}`} />
          ))
          : products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => router.push(`/products/${product.id}`)}
            />
          ))}
      </div>

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
