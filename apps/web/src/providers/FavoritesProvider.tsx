"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useFavorites } from "@/hooks/useFavorites";

type FavoritesContextType = ReturnType<typeof useFavorites>;

const FavoritesContext = createContext<FavoritesContextType | null>(null);

/**
 * Provider that wraps the app and shares favorites state across all components
 * Place this in the root layout after ClerkProvider
 */
export function FavoritesProvider({ children }: { readonly children: ReactNode }) {
  const favoritesState = useFavorites();

  return (
    <FavoritesContext.Provider value={favoritesState}>
      {children}
    </FavoritesContext.Provider>
  );
}

/**
 * Hook to access favorites context from any component
 * Must be used within FavoritesProvider
 */
export function useFavoritesContext() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavoritesContext must be used within FavoritesProvider");
  }

  return context;
}
