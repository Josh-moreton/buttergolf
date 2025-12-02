"use client";

import { Platform } from "react-native";
import {
  Card,
  GlassmorphismCard,
  getGlassmorphismStyles,
  Column,
  Row,
  Text,
  Image,
  View,
} from "@buttergolf/ui";
import type { ProductCardData } from "../types/product";

export interface ProductCardProps {
  product: ProductCardData;
  onPress?: () => void;
  onFavourite?: (productId: string) => void;
  isFavourited?: boolean;
}

// Heart icon component that works on both platforms
function HeartIcon({ filled }: Readonly<{ filled: boolean }>) {
  if (Platform.OS === "web") {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={filled ? "#F45314" : "none"}
        stroke="#F45314"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    );
  }
  // For native, use Text with heart character
  return (
    <Text fontSize={18} color="$primary">
      {filled ? "♥" : "♡"}
    </Text>
  );
}

export function ProductCard({
  product,
  onPress,
  onFavourite,
  isFavourited = false,
}: Readonly<ProductCardProps>) {
  const handleFavouriteClick = () => {
    onFavourite?.(product.id);
  };

  const isWeb = Platform.OS === "web";

  return (
    <Card
      variant="elevated"
      padding={0}
      animation="bouncy"
      backgroundColor="$surface"
      borderColor="$border"
      borderRadius={20}
      cursor="pointer"
      onPress={onPress}
      width={315}
      height={365}
      interactive
      overflow="visible"
      style={
        isWeb
          ? {
              boxShadow:
                "0 14px 28px rgba(0, 0, 0, 0.4), 0 10px 10px rgba(0, 0, 0, 0.3)",
            }
          : undefined
      }
      hoverStyle={{
        transform: "scale(1.02)",
      }}
    >
      {/* Inner container for border radius clipping */}
      <Column width="100%" height="100%" overflow="hidden" borderRadius={20}>
        {/* Container - full height with image */}
        <Column
          position="relative"
          width="100%"
          height="100%"
          overflow="hidden"
        >
          {/* Background Image - Full Card */}
          <Image
            source={{ uri: product.imageUrl }}
            alt={product.title}
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            objectFit="cover"
          />

          {/* Favourite Heart Button - Top Right with Glassmorphism */}
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
              handleFavouriteClick();
            }}
            hoverStyle={{ transform: "scale(1.1)" }}
            pressStyle={{ transform: "scale(0.85)", opacity: 0.8 }}
            animation="bouncy"
            aria-label={
              isFavourited ? "Remove from favourites" : "Add to favourites"
            }
            style={
              isWeb
                ? {
                    ...getGlassmorphismStyles("medium"),
                    transition:
                      "transform 0.15s ease-out, opacity 0.15s ease-out",
                  }
                : undefined
            }
          >
            <HeartIcon filled={isFavourited} />
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
            zIndex={1}
            overflow="hidden"
            justifyContent="center"
            style={isWeb ? getGlassmorphismStyles("medium") : undefined}
          >
            {/* Product Title - Bold, fixed height for 2 lines */}
            <Text
              fontSize={16}
              fontWeight="700"
              lineHeight={21}
              color="$text"
              numberOfLines={2}
              marginBottom="$2"
              height={42}
            >
              {product.title}
            </Text>

            {/* Price */}
            <Text
              fontSize={16}
              fontWeight="600"
              lineHeight={16}
              color="$text"
              marginBottom="$1"
            >
              £{product.price.toFixed(2)}
            </Text>

            {/* Seller Info with Rating */}
            <Row alignItems="center" gap="$2" flexWrap="wrap">
              <Text
                fontSize={16}
                fontWeight="400"
                lineHeight={16}
                color="$textSecondary"
              >
                {product.seller.name}
              </Text>
              {product.seller.ratingCount > 0 ? (
                <Row alignItems="center" gap="$1">
                  <Text color="$primary" fontSize={16}>
                    ★
                  </Text>
                  <Text fontSize={16} fontWeight="600" color="$text">
                    {product.seller.averageRating?.toFixed(1)} (
                    {product.seller.ratingCount})
                  </Text>
                </Row>
              ) : (
                <View
                  backgroundColor="$primary"
                  paddingHorizontal="$1.5"
                  paddingVertical="$0.5"
                  borderRadius="$xs"
                >
                  <Text fontSize={14} fontWeight="600" color="$textInverse">
                    NEW SELLER
                  </Text>
                </View>
              )}
            </Row>
          </GlassmorphismCard>
        </Column>
      </Column>
    </Card>
  );
}
