"use client";

import React, { useEffect, useState } from "react";
import {
  Column,
  Row,
  Button,
  ScrollView,
  Text,
  Image,
} from "@buttergolf/ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ProductCardData } from "../../types/product";
import { Hero } from "../../components/Hero";
import { images } from "@buttergolf/assets";
import { MobileSearchBar, MobileBottomNav } from "../../components/mobile";

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
      {/* Sticky Search Bar - Fixed at top, extends into safe area */}
      <Column
        position="absolute"
        top={0}
        left={0}
        right={0}
        zIndex={100}
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
          paddingBottom: insets.bottom + 80, // Account for bottom nav
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
          showHeroImage={true}
          minHeight={250}
          maxHeight={300}
        />

        {/* Buying/Selling Toggle Buttons */}
        <Row
          gap="$4"
          paddingHorizontal="$4"
          paddingVertical="$4"
          justifyContent="center"
        >
          <Button
            width="40%"
            height={44}
            backgroundColor="$spicedClementine"
            color="$vanillaCream"
            borderRadius="$full"
            fontWeight="700"
            pressStyle={{
              scale: 0.98,
              opacity: 0.9,
            }}
          >
            Buying
          </Button>
          <Button
            width="40%"
            height={44}
            backgroundColor="$cloudMist"
            color="$ironstone"
            borderRadius="$full"
            fontWeight="700"
            pressStyle={{
              scale: 0.98,
              opacity: 0.9,
            }}
          >
            Selling
          </Button>
        </Row>

        {/* Shop by Category Section */}
        <Column paddingHorizontal="$4" paddingTop="$4" paddingBottom="$6" gap="$3">
          <Text
            fontSize="$8"
            fontWeight="900"
            color="$ironstone"
            textAlign="center"
          >
            Shop by category
          </Text>
          <Text
            fontSize="$5"
            fontWeight="400"
            color="$slateSmoke"
            textAlign="center"
          >
            Find exactly what you need - faster.
          </Text>
        </Column>

        {/* Category Cards Grid */}
        <Column paddingHorizontal="$4" gap="$4">
          {/* First row: Drivers & Irons */}
          <Row gap="$4">
            {/* Drivers card */}
            <Column
              flex={1}
              height={180}
              backgroundColor="$vanillaCream"
              borderRadius="$2xl"
              overflow="hidden"
              pressStyle={{ opacity: 0.9, scale: 0.98 }}
            >
              <Image
                source={images.clubs.club1}
                width="100%"
                height="100%"
                resizeMode="cover"
                position="absolute"
              />
              <Column
                flex={1}
                padding="$4"
                justifyContent="flex-end"
                backgroundColor="rgba(0, 0, 0, 0.3)"
              >
                <Text fontSize="$8" fontWeight="700" color="$vanillaCream">
                  Drivers
                </Text>
              </Column>
            </Column>

            {/* Irons card */}
            <Column
              flex={1}
              height={180}
              backgroundColor="$secondary"
              borderRadius="$2xl"
              overflow="hidden"
              pressStyle={{ opacity: 0.9, scale: 0.98 }}
            >
              <Image
                source={images.clubs.club3}
                width="100%"
                height="100%"
                resizeMode="cover"
                position="absolute"
              />
              <Column
                flex={1}
                padding="$4"
                justifyContent="flex-end"
                backgroundColor="rgba(0, 0, 0, 0.3)"
              >
                <Text fontSize="$8" fontWeight="700" color="$vanillaCream">
                  Irons
                </Text>
              </Column>
            </Column>
          </Row>

          {/* Second row: Shoes & Accessories */}
          <Row gap="$4">
            {/* Shoes card */}
            <Column
              flex={1}
              height={180}
              backgroundColor="$vanillaCream"
              borderRadius="$2xl"
              overflow="hidden"
              pressStyle={{ opacity: 0.9, scale: 0.98 }}
            >
              <Image
                source={images.clubs.club5}
                width="100%"
                height="100%"
                resizeMode="cover"
                position="absolute"
              />
              <Column
                flex={1}
                padding="$4"
                justifyContent="flex-end"
                backgroundColor="rgba(0, 0, 0, 0.3)"
              >
                <Text fontSize="$8" fontWeight="700" color="$vanillaCream">
                  Shoes
                </Text>
              </Column>
            </Column>

            {/* Accessories card */}
            <Column
              flex={1}
              height={180}
              backgroundColor="$secondary"
              borderRadius="$2xl"
              overflow="hidden"
              pressStyle={{ opacity: 0.9, scale: 0.98 }}
            >
              <Image
                source={images.clubs.club6}
                width="100%"
                height="100%"
                resizeMode="cover"
                position="absolute"
              />
              <Column
                flex={1}
                padding="$4"
                justifyContent="flex-end"
                backgroundColor="rgba(0, 0, 0, 0.3)"
              >
                <Text fontSize="$8" fontWeight="700" color="$vanillaCream">
                  Accessories
                </Text>
              </Column>
            </Column>
          </Row>
        </Column>
      </ScrollView>

      {/* Bottom Navigation - Fixed at bottom, extends into safe area */}
      <Column
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        zIndex={100}
      >
        <MobileBottomNav
          activeTab="home"
          onHomePress={() => console.log("Home pressed")}
          onWishlistPress={() => console.log("Wishlist pressed")}
          onSellPress={() => console.log("Sell pressed")}
          onMessagesPress={() => console.log("Messages pressed")}
          onLoginPress={() => console.log("Login pressed")}
        />
      </Column>
    </Column>
  );
}
