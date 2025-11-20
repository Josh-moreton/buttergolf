"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

/**
 * Hook to manage the user's complete favorites list
 * Fetches all favorited product IDs on mount and maintains a Set for fast lookups
 */
export function useFavorites() {
  const { user, isLoaded } = useUser();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's favorites on mount
  useEffect(() => {
    async function fetchFavorites() {
      if (!isLoaded) return;

      if (!user) {
        setFavorites(new Set());
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch all favorites (no pagination needed for the Set)
        const response = await fetch("/api/favorites?limit=1000");

        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }

        const data = await response.json();
        const favoriteIds = new Set<string>(
          data.products.map((p: { id: string }) => p.id)
        );

        setFavorites(favoriteIds);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError(err instanceof Error ? err.message : "Failed to load favorites");
        setFavorites(new Set());
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [user, isLoaded]);

  /**
   * Check if a product is favorited
   */
  const isFavorited = (productId: string): boolean => {
    return favorites.has(productId);
  };

  /**
   * Add a product to favorites (for optimistic updates from useFavoriteToggle)
   */
  const addToFavorites = (productId: string) => {
    setFavorites((prev) => new Set([...prev, productId]));
  };

  /**
   * Remove a product from favorites (for optimistic updates from useFavoriteToggle)
   */
  const removeFromFavorites = (productId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
  };

  /**
   * Refresh favorites from server
   */
  const refresh = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/favorites?limit=1000");
      if (!response.ok) throw new Error("Failed to refresh favorites");

      const data = await response.json();
      const favoriteIds = new Set<string>(
        data.products.map((p: { id: string }) => p.id)
      );

      setFavorites(favoriteIds);
    } catch (err) {
      console.error("Error refreshing favorites:", err);
    }
  };

  return {
    favorites,
    isFavorited,
    addToFavorites,
    removeFromFavorites,
    refresh,
    loading,
    error,
    isAuthenticated: !!user,
  };
}
