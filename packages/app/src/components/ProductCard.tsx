"use client";

import { Card, GlassmorphismCard, getGlassmorphismStyles, Column, Row, Text } from "@buttergolf/ui";
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
      width={315}
      height={365}
      interactive
      overflow="visible"
      style={{
        boxShadow: "0 14px 28px rgba(0, 0, 0, 0.4), 0 10px 10px rgba(0, 0, 0, 0.3)",
      }}
      hoverStyle={{ 
        transform: "scale(1.02)",
      }}
    >
      {/* Inner container for border radius clipping */}
      <Column
        width="100%"
        height="100%"
        overflow="hidden"
        borderRadius="$lg"
      >
        {/* Container - full height with image */}
        <Column
          position="relative"
          width="100%"
          height="100%"
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

        {/* Favorite Heart Button - Top Right with Glassmorphism */}
        <GlassmorphismCard
          intensity="medium"
          blur="medium"
          position="absolute"
          top={12}
          right={12}
          width={40}
          height={40}
          borderRadius="$full"
          alignItems="center"
          justifyContent="center"
          zIndex={2}
          cursor="pointer"
          onPress={(e) => {
            e?.stopPropagation?.();
            handleFavoriteClick();
          }}
          hoverStyle={{ transform: "scale(1.1)" }}
          pressStyle={{ transform: "scale(0.85)", opacity: 0.8 }}
          animation="bouncy"
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          style={{
            ...getGlassmorphismStyles("medium"),
            transition: "transform 0.15s ease-out, opacity 0.15s ease-out",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isFavorited ? "#F45314" : "none"}
            stroke={isFavorited ? "#F45314" : "var(--text)"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </GlassmorphismCard>

        {/* iOS Liquid Glass Info Card - Bottom */}
        <GlassmorphismCard
          intensity="medium"
          blur="medium"
          paddingHorizontal="$md"
          paddingVertical="$sm"
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          height={122}
          borderTopWidth={0}
          borderRadius="$lg"
          zIndex={1}
          overflow="hidden"
          justifyContent="center"
          style={{
            ...getGlassmorphismStyles("medium"),
          }}
        >
          {/* Product Title - Bold, fixed height for 2 lines */}
          <p
            style={{
              fontFamily: "var(--font-urbanist)",
              fontSize: "16px",
              fontWeight: 700,
              lineHeight: "1.3",
              color: "#323232",
              margin: "0 0 8px 0",
              padding: 0,
              height: "42px", // Fixed height: 16px * 1.3 * 2 lines ≈ 42px
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.title}
          </p>

          {/* Price */}
          <Text
            fontSize={16}
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
            gap="$2"
            flexWrap="wrap"
          >
            <Text
              fontSize={16}
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
                <Text color="$primary" fontSize={16}>★</Text>
                <Text
                  fontSize={16}
                  fontWeight="600"
                  color="$text"
                >
                  {product.seller.averageRating?.toFixed(1)} ({product.seller.ratingCount})
                </Text>
              </Row>
            ) : (
              <Text
                fontSize={14}
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
      </Column>
    </Card>
  );
}
