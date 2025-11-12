"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Column, Card, Image, Text, Row, Button, Spinner } from "@buttergolf/ui";
import type { ProductCardData } from "@buttergolf/app";

interface ProductsGridProps {
  products: ProductCardData[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

function ProductCard({ product }: { product: ProductCardData }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <Card
      padding={0}
      borderRadius="$md"
      overflow="hidden"
      cursor="pointer"
      hoverStyle={{ scale: 1.01 }}
      onPress={handleClick}
      minHeight={380}
      display="flex"
      flexDirection="column"
    >
      <div style={{ position: "relative" }}>
        {/* 1:1 Aspect Ratio Container */}
        <div style={{ position: "relative", paddingBottom: "100%", overflow: "hidden", width: "100%" }}>
          <Image
            source={{ uri: product.imageUrl }}
            width="100%"
            height="100%"
            objectFit="cover"
            alt={product.title}
            position="absolute"
            top={0}
            left={0}
          />
        </div>

        {/* NEW Badge Overlay */}
        {product.condition === "NEW" && (
          <div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}>
            <Text size="xs" weight="bold" backgroundColor="$success" color="$textInverse" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$sm">
              NEW
            </Text>
          </div>
        )}
      </div>

      <Column padding="$md" gap="$xs" flex={1} justifyContent="space-between">
        <Column gap="$xs">
          <Text weight="bold" numberOfLines={2} minHeight={42}>
            {product.title}
          </Text>
          <Row alignItems="center" justifyContent="space-between" minHeight={24}>
            <Text size="lg" weight="bold" color="$primary">
              £{product.price.toFixed(2)}
            </Text>
            {product.condition && product.condition !== "NEW" && (
              <Text size="xs" color="$textSecondary">
                {product.condition?.replace("_", " ") || ""}
              </Text>
            )}
          </Row>
        </Column>
        <Button size="sm" tone="outline" fullWidth onPress={handleClick}>
          View details
        </Button>
      </Column>
    </Card>
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
          gridAutoRows: "1fr",
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
