"use client";

import React, { useEffect, useState } from "react";
import {
  Column,
  ScrollView,
  Text,
} from "@buttergolf/ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ProductCardData } from "../../types/product";
import { Hero } from "../../components/Hero";
import { images } from "@buttergolf/assets";
import { MobileSearchBar } from "../../components/mobile";

interface LoggedOutHomeScreenProps {
  products?: ProductCardData[];
  onFetchProducts?: () => Promise<ProductCardData[]>;
  onProductPress?: (id: string) => void;
  onSignIn?: () => void;
}

export function LoggedOutHomeScreen({
  products: initialProducts = [],
  onFetchProducts,
}: Readonly<LoggedOutHomeScreenProps>) {
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<ProductCardData[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (onFetchProducts && products.length === 0 && !loading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
      onFetchProducts()
        .then((fetchedProducts) => {
          console.log(`Fetched ${fetchedProducts.length} products`);
          if (fetchedProducts.length > 0) {
            console.log(
              "First product image URL:",
              fetchedProducts[0]?.imageUrl
            );
          }
          setProducts(fetchedProducts);
        })
        .catch((error) => {
          console.error("Failed to fetch products:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [onFetchProducts, products.length, loading]);

  return (
    <Column flex={1} backgroundColor="$background">
      {/* Sticky Search Bar - Fixed at top with safe area, drop shadow, and rounded corners */}
      <Column
        position="absolute"
        top={0}
        left={0}
        right={0}
        zIndex={100}
        paddingTop={insets.top}
      >
        <Column
          backgroundColor="$background"
          borderBottomLeftRadius="$2xl"
          borderBottomRightRadius="$2xl"
          shadowColor="rgba(0, 0, 0, 0.15)"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={1}
          shadowRadius={8}
          elevation={8}
        >
          <MobileSearchBar
            placeholder="What are you looking for?"
            onSearch={(query: string) => console.log("Search query:", query)}
          />
        </Column>
      </Column>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 80, // Account for sticky search bar height
          paddingBottom: insets.bottom + 20,
        }}
      >
        {/* Hero Section - Scrolls under the search bar */}
        <Hero
          heading={{
            line1: "Swing Smarter.",
            line2: "Shop Better.",
          }}
          subtitle="Buy, Sell, and Upgrade Your Game"
          backgroundImage={images.hero.background}
          heroImage={images.hero.club}
          showHeroImage={false}
          minHeight={300}
          maxHeight={400}
        />

        {/* Placeholder for future content */}
        <Column padding="$8" alignItems="center">
          <Text color="$textSecondary" textAlign="center">
            Content coming soon...
          </Text>
        </Column>
      </ScrollView>
    </Column>
  );
}
