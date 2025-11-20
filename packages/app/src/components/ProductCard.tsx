"use client";

import { Card, GlassmorphismCard, getGlassmorphismStyles } from "@buttergolf/ui";
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
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    >
      {/* Inner wrapper that handles hover transform */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.02)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {/* Container with aspect ratio (9:10 - 450px x 500px) */}
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: "111.11%",
            overflow: "hidden",
          }}
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
          <button
            onClick={handleFavoriteClick}
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "white",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              zIndex: 2,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={isFavorited ? "#F45314" : "none"}
              stroke={isFavorited ? "#F45314" : "#323232"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* iOS Liquid Glass Info Card - Bottom */}
          <GlassmorphismCard
            intensity="light"
            blur="medium"
            padding="$md"
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            borderWidth={1}
            borderColor="rgba(255, 255, 255, 0.2)"
            borderTopWidth={0}
            borderRadius="$lg"
            zIndex={1}
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
                lineHeight: 1.3,
                color: "#323232",
                margin: "0 0 8px 0",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {product.title}
            </p>

            {/* Price */}
            <p
              style={{
                fontFamily: "var(--font-urbanist)",
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: 1,
                color: "#323232",
                margin: "0 0 6px 0",
              }}
            >
              £{product.price.toFixed(2)}
            </p>

            {/* Seller Info with Rating */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                flexWrap: "wrap",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-urbanist)",
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: 1,
                  color: "#545454",
                  margin: 0,
                }}
              >
                {product.seller.name}
              </p>
              {product.seller.ratingCount > 0 ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <span style={{ color: "#F45314", fontSize: "12px" }}>★</span>
                  <span
                    style={{
                      fontFamily: "var(--font-urbanist)",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#323232",
                    }}
                  >
                    {product.seller.averageRating?.toFixed(1)} ({product.seller.ratingCount})
                  </span>
                </div>
              ) : (
                <span
                  style={{
                    fontFamily: "var(--font-urbanist)",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    backgroundColor: "#F45314",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  NEW SELLER
                </span>
              )}
            </div>
          </GlassmorphismCard>
        </div>
      </div>
    </Card>
  );
}
