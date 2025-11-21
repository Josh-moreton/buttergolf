"use client";

import { Card, GlassmorphismCard, getGlassmorphismStyles, Column, Row, Text, Button } from "@buttergolf/ui";
import type { ProductCardData } from "../types/product";

export interface ProductCardProps {
  product: ProductCardData;
  onPress?: () => void;
  onFavorite?: (productId: string) => void;
  isFavorited?: boolean;
}

export function ProductCard({
  product,
  onPress,
  onFavorite,
  isFavorited = false
}: Readonly<ProductCardProps>) {
  const handleFavoriteClick = () => {
    onFavorite?.(product.id);
  };

  return (
    <Card
      variant="elevated"
      padding={0}
      animation="bouncy"
      backgroundColor="$surface"
      borderColor="$border"
      cursor="pointer"
      onPress={onPress}
      width="100%"
      interactive
      overflow="hidden"
      hoverStyle={{ transform: "scale(1.02)" }}
    >
      {/* Container with aspect ratio (9:10 - 450px x 500px) */}
      <Column
        position="relative"
        width="100%"
        paddingBottom="111.11%"
        overflow="hidden"
      >
        {/* Background Image - Full Card */}
        <img
          src={product.imageUrl}
          alt={product.title}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Favorite Heart Button - Top Right */}
        <Button
          circular
          chromeless
          onPress={handleFavoriteClick}
          position="absolute"
          top={12}
          right={12}
          width={40}
          height={40}
          backgroundColor="$background"
          alignItems="center"
          justifyContent="center"
          zIndex={2}
          hoverStyle={{ transform: "scale(1.1)" }}
          pressStyle={{ transform: "scale(0.95)" }}
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isFavorited ? "var(--primary)" : "none"}
            stroke={isFavorited ? "var(--primary)" : "var(--text)"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </Button>

        {/* iOS Liquid Glass Info Card - Bottom */}
        <GlassmorphismCard
          intensity="light"
          blur="medium"
          paddingHorizontal="$md"
          paddingVertical="$lg"
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          borderWidth={1}
          borderColor="rgba(255, 255, 255, 0.2)"
          borderTopWidth={0}
          borderRadius="$lg"
          zIndex={1}
          backgroundColor="rgba(255, 255, 255, 0.15)"
          overflow="visible"
          style={{
            ...getGlassmorphismStyles("medium"),
          }}
        >
          {/* Product Title - Bold */}
          <p
            style={{
              fontFamily: "var(--font-urbanist)",
              fontSize: "18px",
              fontWeight: 700,
              lineHeight: "1.4",
              color: "#323232",
              margin: "0 0 8px 0",
              padding: 0,
              maxHeight: "50px",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as any,
            }}
          >
            {product.title}
          </p>

          {/* Price */}
          <Text
            size="$6"
            fontWeight="600"
            lineHeight={1}
            color="$text"
            marginBottom="$1.5"
          >
            £{product.price.toFixed(2)}
          </Text>

          {/* Seller Info with Rating */}
          <Row
            alignItems="center"
            gap="$1.5"
            flexWrap="wrap"
          >
            <Text
              size="$3"
              fontWeight="400"
              lineHeight={1}
              color="$textSecondary"
            >
              {product.seller.name}
            </Text>
            {product.seller.ratingCount > 0 ? (
              <Row
                alignItems="center"
                gap="$1"
              >
                <Text color="$primary" fontSize={12}>★</Text>
                <Text
                  fontSize={12}
                  fontWeight="600"
                  color="$text"
                >
                  {product.seller.averageRating?.toFixed(1)} ({product.seller.ratingCount})
                </Text>
              </Row>
            ) : (
              <Text
                fontSize={11}
                fontWeight="600"
                color="$textInverse"
                backgroundColor="$primary"
                paddingHorizontal="$1.5"
                paddingVertical="$0.5"
                borderRadius="$xs"
              >
                NEW SELLER
              </Text>
            )}
          </Row>
        </GlassmorphismCard>
      </Column>
    </Card>
  );
}
