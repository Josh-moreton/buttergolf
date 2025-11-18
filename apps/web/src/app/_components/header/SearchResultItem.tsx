"use client";

import Link from "next/link";
import { Row, Column, Text, Image, Badge } from "@buttergolf/ui";
import type { ProductCardData } from "@buttergolf/app";

interface SearchResultItemProps {
  product: ProductCardData;
  onSelect?: () => void;
}

export function SearchResultItem({ product, onSelect }: SearchResultItemProps) {
  return (
    <Link href={`/products/${product.id}`} onClick={onSelect}>
      <Row
        padding="$3"
        gap="$3"
        hoverStyle={{ backgroundColor: "$backgroundHover" }}
        cursor="pointer"
        alignItems="center"
        width="100%"
      >
        {/* Product Thumbnail */}
        <Image
          source={{ uri: product.imageUrl }}
          width={60}
          height={60}
          borderRadius="$sm"
          objectFit="cover"
          alt={product.title}
        />

        {/* Product Details */}
        </Column>
        <Column gap="$xs" flex={1}>
          <Text weight="semibold" numberOfLines={1} fontSize="$3">
            {title}
          </Text>
          {subtitle && (
            <Text fontSize="$2" {...{ color: "$textMuted" }}>

        {/* Price */}
        <Text weight="bold" {...{ color: "$primary" }} flexShrink={0}>
          £{product.price.toFixed(2)}
        </Text>
      </Row>
    </Link>
  );
}
