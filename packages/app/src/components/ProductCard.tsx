"use client";

import { useState } from "react";
import { Card } from "@buttergolf/ui";
import type { ProductCardData } from "../types/product";

export interface ProductCardProps {
  product: ProductCardData;
  onPress?: () => void;
  onFavorite?: (productId: string) => void;
}

export function ProductCard({
  product,
  onPress,
  onFavorite
}: Readonly<ProductCardProps>) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
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
        {/* Container with portrait aspect ratio (1:1.4 - taller than wide) */}
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: "140%",
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

        {/* Dark Gradient Overlay for Text Readability */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)",
            pointerEvents: "none",
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

        {/* Text Overlay - Bottom Left */}
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            right: "16px",
            zIndex: 1,
          }}
        >
          {/* Product Title - Bold */}
          <p
            style={{
              fontFamily: "var(--font-urbanist)",
              fontSize: "18px",
              fontWeight: 700,
              lineHeight: 1.3,
              color: "#FFFFFF",
              margin: "0 0 8px 0",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
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
              color: "#FFFFFF",
              margin: "0 0 4px 0",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            £{product.price.toFixed(2)}
          </p>

          {/* Seller Name (if available) */}
          {(product as ProductCardData & { sellerName?: string }).sellerName && (
            <p
              style={{
                fontFamily: "var(--font-urbanist)",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: 1,
                color: "#FFFFFF",
                opacity: 0.9,
                margin: 0,
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              by {(product as ProductCardData & { sellerName?: string }).sellerName}
            </p>
          )}
        </div>
      </div>
      </div>
    </Card>
  );
}
