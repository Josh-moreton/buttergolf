import { useState, useEffect, useCallback } from "react";
import type { Prisma } from "@prisma/client";

/**
 * Custom Hook: Poll for Offer Updates
 * 
 * Fetches offer data from API at regular intervals for real-time updates.
 * Provides refetch function for manual updates after actions.
 * 
 * Usage:
 * ```tsx
 * const { offer, loading, error, refetch } = useOfferUpdates({
 *   offerId: "123",
 *   enabled: true,
 *   interval: 5000, // 5 seconds
 *   initialOffer: serverOffer
 * });
 * ```
 * 
 * Future: Replace with WebSocket connection for true real-time updates
 */

type OfferWithRelations = Prisma.OfferGetPayload<{
  include: {
    product: {
      include: {
        images: true;
        user: true;
      };
    };
    buyer: true;
    seller: true;
    counterOffers: true;
  };
}>;

interface UseOfferUpdatesOptions {
  offerId: string;
  enabled: boolean;
  interval: number; // milliseconds
  initialOffer: OfferWithRelations;
}

interface UseOfferUpdatesResult {
  offer: OfferWithRelations;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOfferUpdates({
  offerId,
  enabled,
  interval,
  initialOffer,
}: UseOfferUpdatesOptions): UseOfferUpdatesResult {
  const [offer, setOffer] = useState<OfferWithRelations>(initialOffer);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch offer data from API
   */
  const fetchOffer = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/offers/${offerId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch offer: ${response.statusText}`);
      }

      const data = await response.json();
      setOffer(data.offer);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error fetching offer:", err);
    } finally {
      setLoading(false);
    }
  }, [offerId, enabled]);

  /**
   * Set up polling interval
   */
  useEffect(() => {
    if (!enabled) return;

    // Fetch immediately on mount
    fetchOffer();

    // Set up interval for polling
    const intervalId = setInterval(() => {
      fetchOffer();
    }, interval);

    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [enabled, interval, fetchOffer]);

  return {
    offer,
    loading,
    error,
    refetch: fetchOffer,
  };
}
