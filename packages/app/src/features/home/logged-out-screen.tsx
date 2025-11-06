"use client";

import React, { useEffect, useState } from "react";
import { Dimensions, Image as RNImage } from "react-native";
import {
  Column,
  Row,
  ScrollView,
  Button,
  Text,
  Card,
  View,
} from "@buttergolf/ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Search as SearchIcon,
  Camera,
  Home,
  PlusCircle,
  Mail,
  User,
} from "@tamagui/lucide-icons";
import type { ProductCardData } from "../../types/product";
import { CATEGORIES } from "@buttergolf/db";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface LoggedOutHomeScreenProps {
  products?: ProductCardData[];
  onFetchProducts?: () => Promise<ProductCardData[]>;
  onProductPress?: (id: string) => void;
  onSignIn?: () => void;
}

export function LoggedOutHomeScreen({
  products: initialProducts = [],
  onFetchProducts,
  onProductPress,
  onSignIn,
}: Readonly<LoggedOutHomeScreenProps>) {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [products, setProducts] = useState<ProductCardData[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  // Calculate card dimensions (2 columns with gap)
  const gap = 8;
  const horizontalPadding = 16;
  const cardWidth = (SCREEN_WIDTH - horizontalPadding * 2 - gap) / 2;

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
      {/* Search Bar */}
      <Column
        paddingTop={insets.top + 8}
        paddingHorizontal="$4"
        paddingBottom="$3"
        backgroundColor="$background"
        borderBottomWidth={1}
        borderBottomColor="$border"
      >
        <Row gap="$3" alignItems="center">
          <Row
            flex={1}
            height={40}
            backgroundColor="$gray100"
            borderRadius="$md"
            paddingHorizontal="$3"
            alignItems="center"
            gap="$2"
          >
            <SearchIcon size={20} color="$textMuted" />
            <Text color="$textMuted" fontSize={15}>
              Search for items or members
            </Text>
          </Row>
          <Button
            size="$3"
            chromeless
            padding="$2"
            onPress={() => console.log("Camera pressed")}
          >
            <Camera size={24} color="$primary" />
          </Button>
        </Row>
      </Column>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          gap: 8,
        }}
      >
        <Button
          key="all"
          size="$3"
          paddingHorizontal="$4"
          paddingVertical="$2"
          borderRadius="$full"
          backgroundColor={selectedCategory === "All" ? "$primary" : "$white"}
          borderWidth={1}
          borderColor={selectedCategory === "All" ? "$primary" : "$border"}
          color={selectedCategory === "All" ? "$white" : "$text"}
          onPress={() => setSelectedCategory("All")}
          pressStyle={{
            scale: 0.95,
          }}
        >
          All
        </Button>
        {CATEGORIES.map((category) => (
          <Button
            key={category.slug}
            size="$3"
            paddingHorizontal="$4"
            paddingVertical="$2"
            borderRadius="$full"
            backgroundColor={
              selectedCategory === category.name ? "$primary" : "$white"
            }
            borderWidth={1}
            borderColor={
              selectedCategory === category.name ? "$primary" : "$border"
            }
            color={selectedCategory === category.name ? "$white" : "$text"}
            onPress={() => setSelectedCategory(category.name)}
            pressStyle={{
              scale: 0.95,
            }}
          >
            {category.name}
          </Button>
        ))}
      </ScrollView>

      {/* Product Grid */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 8,
          paddingBottom: insets.bottom + 72,
        }}
      >
        {loading && products.length === 0 ? (
          <Column padding="$8" alignItems="center">
            <Text color="$textSecondary">Loading products...</Text>
          </Column>
        ) : products.length === 0 ? (
          <Column padding="$8" alignItems="center">
            <Text color="$textSecondary">No products available yet</Text>
          </Column>
        ) : (
          <Row flexWrap="wrap" gap={gap} width="100%">
            {products.map((product) => (
              <Card
                key={product.id}
                width={cardWidth}
                padding={0}
                borderRadius="$md"
                overflow="hidden"
                backgroundColor="$white"
                pressStyle={{ scale: 0.98 }}
                animation="quick"
                onPress={
                  onProductPress ? () => onProductPress(product.id) : undefined
                }
              >
                {/* Product Image */}
                <View width="100%" height={cardWidth * 1.3} position="relative">
                  <RNImage
                    source={{ uri: product.imageUrl }}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    resizeMode="cover"
                  />
                </View>

                {/* Product Info */}
                <Column padding="$2" gap="$1">
                  <Text fontSize={14} fontWeight="500" numberOfLines={1}>
                    {product.title}
                  </Text>
                  <Text fontSize={12} color="$textSecondary">
                    {product.category}
                    {product.condition &&
                      ` · ${product.condition.replace("_", " ")}`}
                  </Text>
                  <Text fontSize={16} fontWeight="600" color="$primary">
                    £{product.price.toFixed(2)}
                  </Text>
                </Column>
              </Card>
            ))}
          </Row>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <Column
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        backgroundColor="$white"
        borderTopWidth={1}
        borderTopColor="$border"
        paddingBottom={insets.bottom}
        paddingTop="$3"
      >
        <Row
          paddingVertical="$2"
          alignItems="center"
          justifyContent="space-around"
        >
          <Button
            chromeless
            flexDirection="column"
            gap="$1"
            padding="$2"
            onPress={() => {}}
          >
            <Home size={24} color="$primary" />
            <Text fontSize={11} color="$primary" fontWeight="600">
              Home
            </Text>
          </Button>

          <Button
            chromeless
            flexDirection="column"
            gap="$1"
            padding="$2"
            onPress={() => {}}
          >
            <SearchIcon size={24} color="$textSecondary" />
            <Text fontSize={11} color="$textSecondary">
              Search
            </Text>
          </Button>

          <Button
            chromeless
            flexDirection="column"
            gap="$1"
            padding="$2"
            onPress={() => {}}
          >
            <PlusCircle size={24} color="$textSecondary" />
            <Text fontSize={11} color="$textSecondary">
              Sell
            </Text>
          </Button>

          <Button
            chromeless
            flexDirection="column"
            gap="$1"
            padding="$2"
            onPress={() => {}}
          >
            <Mail size={24} color="$textSecondary" />
            <Text fontSize={11} color="$textSecondary">
              Inbox
            </Text>
          </Button>

          <Button
            chromeless
            flexDirection="column"
            gap="$1"
            padding="$2"
            onPress={onSignIn}
          >
            <User size={24} color="$textSecondary" />
            <Text fontSize={11} color="$textSecondary">
              Profile
            </Text>
          </Button>
        </Row>
      </Column>
    </Column>
  );
}
