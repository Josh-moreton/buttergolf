"use client";

import { useState, useEffect, useRef } from "react";
import { Column, Card, Image, Text, Row, Button, Spinner } from "@buttergolf/ui";
import type { ProductCardData } from "@buttergolf/app";
import { ProductDetailModal } from "../../_components/marketplace/ProductDetailModal";

interface ProductsGridProps {
  products: ProductCardData[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

function ProductCard({ product }: { product: ProductCardData }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Card
        padding={0}
        borderRadius="$md"
        overflow="hidden"
        cursor="pointer"
        hoverStyle={{ scale: 1.01 }}
        onPress={() => setModalOpen(true)}
      >
        <Image
          source={{ uri: product.imageUrl }}
          width="100%"
          height={180}
          objectFit="cover"
          alt={product.title}
        />
        <Column padding="$md" gap="$xs">
          <Text weight="bold" numberOfLines={2}>
            {product.title}
          </Text>
          <Row alignItems="center" justifyContent="space-between">
            <Text fontSize="$7" weight="bold" fontWeight="800">
              £{product.price.toFixed(2)}
            </Text>
            <Text fontSize="$2" opacity={0.7}>
              {product.condition?.replace("_", " ") || ""}
            </Text>
          </Row>
          <Button size="$4" onPress={() => setModalOpen(true)}>
            View details
          </Button>
        </Column>
      </Card>

      {modalOpen && (
        <ProductDetailModal
          productId={product.id}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      )}
    </>
  );
}

function LoadingSkeleton() {
  return (
    <Card padding={0} borderRadius="$md" overflow="hidden">
      <div
        style={{
          width: "100%",
          height: 180,
          backgroundColor: "#f0f0f0",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <Column padding="$md" gap="$xs">
        <div
          style={{
            height: 20,
            backgroundColor: "#f0f0f0",
            borderRadius: 4,
            width: "80%",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: 16,
            backgroundColor: "#f0f0f0",
            borderRadius: 4,
            width: "40%",
            animation: "pulse 1.5s ease-in-out infinite",
            marginTop: 8,
          }}
        />
      </Column>
    </Card>
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
          <ProductCard key={product.id} product={product} />
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
