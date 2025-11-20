"use client";

import { ProductCard as SharedProductCard } from "@buttergolf/app";
import type { ProductCardData } from "@buttergolf/app";
import { useFavoriteToggle } from "@/hooks/useFavoriteToggle";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, Text } from "@buttergolf/ui";

export interface ProductCardProps {
  readonly product: ProductCardData;
  readonly onPress?: () => void;
}

/**
 * Web-specific ProductCard wrapper that adds favorite functionality
 * Uses useFavoriteToggle hook to persist favorites to database
 */
export function ProductCard({ product, onPress }: ProductCardProps) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { isFavorited, toggleFavorite } = useFavoriteToggle(product.id);
  const [showAuthMessage, setShowAuthMessage] = useState(false);

  const handleFavorite = async () => {
    // Require authentication
    if (!isSignedIn) {
      setShowAuthMessage(true);
      // Redirect to sign-in after 1 second
      setTimeout(() => {
        router.push(`/sign-in?redirect_url=${encodeURIComponent(globalThis.location.pathname)}`);
      }, 1000);
      return;
    }

    // Toggle favorite with optimistic update
    const result = await toggleFavorite();

    if (result && !result.success && result.error) {
      // Show error toast (could be enhanced with a toast library)
      console.error("Failed to toggle favorite:", result.error);
    }
  };

  return (
    <>
      <SharedProductCard
        product={product}
        onPress={onPress}
        onFavorite={handleFavorite}
        isFavorited={isFavorited}
      />
      {showAuthMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
          }}
        >
          <Card
            variant="elevated"
            padding="$md"
            backgroundColor="$secondary"
            borderRadius="$md"
          >
            <Text fontSize="$4" color="$textInverse" fontWeight="500">
              Please sign in to add favorites
            </Text>
          </Card>
        </div>
      )}
    </>
  );
}
