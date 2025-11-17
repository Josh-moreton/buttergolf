"use client";

import { Column, Row, Text } from "@buttergolf/ui";
import { ProductCard } from "@buttergolf/app";
import type { ProductCardData } from "@buttergolf/app";
import Link from "next/link";

interface ProductsGridProps {
  products: ProductCardData[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
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
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          border: "none",
          backgroundColor: "transparent",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
          opacity: currentPage === 1 ? 0.4 : 1,
          fontSize: "20px",
          color: "#F45314",
          fontFamily: "var(--font-urbanist)",
        }}
      >
        ‹
      </button>

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
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "40px",
              height: "40px",
              padding: "0 12px",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: isActive ? 600 : 400,
              color: isActive ? "#F45314" : "#323232",
              textDecoration: isActive ? "underline" : "none",
              fontFamily: "var(--font-urbanist)",
            }}
          >
            {page}
          </button>
        );
      })}

      {/* Next arrow */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          border: "none",
          backgroundColor: "transparent",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          opacity: currentPage === totalPages ? 0.4 : 1,
          fontSize: "20px",
          color: "#F45314",
          fontFamily: "var(--font-urbanist)",
        }}
      >
        ›
      </button>
    </Row>
  );
}

export function ProductsGrid({
  products,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}: ProductsGridProps) {
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
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              <ProductCard
                product={product}
                onFavorite={(productId) =>
                  console.log("Favorited:", productId)
                }
              />
            </Link>
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

      <style jsx>{`
        @media (min-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (min-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </Column>
  );
}
