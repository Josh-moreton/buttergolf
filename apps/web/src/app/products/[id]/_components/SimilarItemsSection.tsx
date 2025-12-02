"use client";

import { Column, Heading, Text } from "@buttergolf/ui";
import type { ProductCardData } from "@buttergolf/app";
import { ProductCarousel } from "../../../_components/shared/ProductCarousel";

interface SimilarItemsSectionProps {
  products: ProductCardData[];
  category: string;
}

export function SimilarItemsSection({
  products,
  category,
}: SimilarItemsSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <Column paddingVertical="$10" backgroundColor="$cloudMist" width="100%">
      <Column
        maxWidth={1200}
        marginHorizontal="auto"
        paddingHorizontal="$6"
        width="100%"
        gap="$2xl"
      >
        {/* Header */}
        <Column gap="$md" alignItems="center">
          <Heading level={2} color="$secondary" textAlign="center">
            Similar Items
          </Heading>
          <Text color="$textSecondary" textAlign="center">
            Other {category.toLowerCase()} items you might like
          </Text>
        </Column>

        {/* Products Carousel */}
        <ProductCarousel
          products={products}
          autoplay={true}
          autoplayDelay={5000}
        />
      </Column>
    </Column>
  );
}
