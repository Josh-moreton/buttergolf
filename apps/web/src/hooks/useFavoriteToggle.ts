"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useFavoritesContext } from "../providers/FavoritesProvider";

/**
 * Hook to toggle a single product's favorite status with optimistic updates
 * Handles API calls, rollback on error, and shows toast notifications
 */
export function useFavoriteToggle(productId: string) {
  const { user } = useUser();
  const {
    isFavorited: isGloballyFavorited,
    addToFavorites,
    removeFromFavorites,
  } = useFavoritesContext();

  const [isUpdating, setIsUpdating] = useState(false);
  const isFavorited = isGloballyFavorited(productId);

  /**
   * Toggle favorite with optimistic update and rollback on error
   */
  const toggleFavorite = async () => {
    // Require authentication
    if (!user) {
      // Trigger sign-in modal (handled by parent component)
      return { requiresAuth: true };
    }

    // Prevent concurrent updates
    if (isUpdating) return { success: false };

    const wasOptimisticUpdate = !isFavorited;

    try {
      setIsUpdating(true);

      // Optimistic update
      if (wasOptimisticUpdate) {
        addToFavorites(productId);
      } else {
        removeFromFavorites(productId);
      }

      // API call
      const response = await fetch(
        wasOptimisticUpdate
          ? "/api/favorites"
          : `/api/favorites/${productId}`,
        {
          method: wasOptimisticUpdate ? "POST" : "DELETE",
          headers: wasOptimisticUpdate
            ? { "Content-Type": "application/json" }
            : {},
          body: wasOptimisticUpdate
            ? JSON.stringify({ productId })
            : undefined,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update favorite");
      }

      return { success: true, action: wasOptimisticUpdate ? "added" : "removed" };
    } catch (error) {
      // Rollback optimistic update
      if (wasOptimisticUpdate) {
        removeFromFavorites(productId);
      } else {
        addToFavorites(productId);
      }

      console.error("Error toggling favorite:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isFavorited,
    toggleFavorite,
    isUpdating,
  };
}
