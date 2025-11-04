"use client";

import { Card, Image, Text, Row, Column, Badge } from "@buttergolf/ui";
import type { ProductCardData } from "../types/product";

export interface ProductCardProps {
  product: ProductCardData;
  onPress?: () => void;
}

export function ProductCard({ product, onPress }: Readonly<ProductCardProps>) {
  return (
    <Card
      variant="elevated"
      padding={0}
      animation="bouncy"
      backgroundColor="$surface"
      borderColor="$border"
      hoverStyle={{
        borderColor: "$borderHover",
        shadowColor: "$shadowColorHover",
        shadowRadius: 12,
      }}
      pressStyle={{ scale: 0.98 }}
      cursor="pointer"
      onPress={onPress}
      width="100%"
      maxWidth={280}
      interactive
    >
      <Card.Header padding={0} noBorder>
        <Image
          source={{ uri: product.imageUrl }}
          width="100%"
          height={200}
          objectFit="cover"
          borderTopLeftRadius="$lg"
          borderTopRightRadius="$lg"
          backgroundColor="$background"
        />
      </Card.Header>
      <Card.Body padding="$md">
        <Column gap="$xs" width="100%">
          <Text size="md" weight="semibold" numberOfLines={2}>
            {product.title}
          </Text>
          <Row gap="$sm" alignItems="center" justifyContent="space-between">
            <Text size="sm" {...{ color: "secondary" as any }}>
              {product.category}
            </Text>
            {product.condition && (
              <Badge variant="neutral" size="sm">
                {product.condition.replace("_", " ")}
              </Badge>
            )}
          </Row>
          <Text size="lg" weight="bold" color="$primary">
            £{product.price.toFixed(2)}
          </Text>
        </Column>
      </Card.Body>
    </Card>
  );
}

