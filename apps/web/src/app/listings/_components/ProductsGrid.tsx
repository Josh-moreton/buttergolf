"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Column, Text, Spinner } from "@buttergolf/ui";
import { ProductCard } from "@buttergolf/app";
import type { ProductCardData } from "@buttergolf/app";
import Link from "next/link";

interface ProductsGridProps {
  products: ProductCardData[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
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

export function ProductsGrid({
  products,
  hasMore,
  isLoading,
  onLoadMore,
}: ProductsGridProps) {
  const observerRef = useRef<HTMLDivElement>(null);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  if (!isLoading && products.length === 0) {
    return (
      <Column
        alignItems="center"
        justifyContent="center"
        paddingVertical="$10"
        gap="$md"
      >
        <Text size="xl" weight="semibold" color="$textSecondary">
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "24px",
          width: "100%",
        }}
      >
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            style={{ textDecoration: "none", display: "block" }}
          >
            <ProductCard
              product={product}
              onFavorite={(productId) => console.log("Favorited:", productId)}
            />
          </Link>
        ))}

        {/* Loading skeletons */}
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <LoadingSkeleton key={`skeleton-${i}`} />
          ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={observerRef} style={{ height: 20, width: "100%" }} />

      {/* Loading indicator */}
      {isLoading && hasMore && (
        <Column alignItems="center" paddingVertical="$lg">
          <Spinner size="lg" color="$primary" />
        </Column>
      )}

      {/* End of results message */}
      {!hasMore && products.length > 0 && (
        <Column alignItems="center" paddingVertical="$lg">
          <Text color="$textSecondary">You've reached the end</Text>
        </Column>
      )}
    </Column>
  );
}
