"use client";

import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import {
  Column,
  Row,
  ScrollView,
  Button,
  Text,
  Card,
  Image,
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CATEGORIES = [
  "All",
  "Drivers",
  "Fairway Woods",
  "Hybrids",
  "Irons",
  "Wedges",
  "Putters",
  "Bags",
  "Balls",
  "Accessories",
];

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
      setLoading(true);
      onFetchProducts()
        .then(setProducts)
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
            <SearchIcon size={20} {...{ color: "$textMuted" as any }} />
            <Text {...{ color: "$textMuted" as any }} fontSize={15}>
              Search for items or members
            </Text>
          </Row>
          <Button
            size="$3"
            chromeless
            padding="$2"
            onPress={() => console.log("Camera pressed")}
          >
            <Camera size={24} {...{ color: "$primary" as any }} />
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
        {CATEGORIES.map((category) => (
          <Button
            key={category}
            size="$3"
            paddingHorizontal="$4"
            paddingVertical="$2"
            borderRadius="$full"
            backgroundColor={
              selectedCategory === category ? "$primary" : "$white"
            }
            borderWidth={1}
            borderColor={
              selectedCategory === category ? "$primary" : "$border"
            }
            color={selectedCategory === category ? "$white" : "$text"}
            onPress={() => setSelectedCategory(category)}
            pressStyle={{
              scale: 0.95,
            }}
          >
            {category}
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
            <Text {...{ color: "$textSecondary" as any }}>
              Loading products...
            </Text>
          </Column>
        ) : products.length === 0 ? (
          <Column padding="$8" alignItems="center">
            <Text {...{ color: "$textSecondary" as any }}>
              No products available yet
            </Text>
          </Column>
        ) : (
          <Row flexWrap="wrap" gap={gap} width="100%">
            {products.map((product) => (
              <Card
                key={product.id}
                width={cardWidth}
                {...{ padding: "none" as any }}
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
                  <Image
                    source={{ uri: product.imageUrl }}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                  />
                </View>

                {/* Product Info */}
                <Column padding="$2" gap="$1">
                  <Text fontSize={14} fontWeight="500" numberOfLines={1}>
                    {product.title}
                  </Text>
                  <Text fontSize={12} {...{ color: "$textSecondary" as any }}>
                    {product.category}
                    {product.condition && ` · ${product.condition.replace("_", " ")}`}
                  </Text>
                  <Text
                    fontSize={16}
                    fontWeight="600"
                    {...{ color: "$primary" as any }}
                  >
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
            <Home size={24} {...{ color: "$primary" as any }} />
            <Text fontSize={11} {...{ color: "$primary" as any }} fontWeight="600">
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
            <SearchIcon size={24} {...{ color: "$textSecondary" as any }} />
            <Text fontSize={11} {...{ color: "$textSecondary" as any }}>
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
            <PlusCircle size={24} {...{ color: "$textSecondary" as any }} />
            <Text fontSize={11} {...{ color: "$textSecondary" as any }}>
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
            <Mail size={24} {...{ color: "$textSecondary" as any }} />
            <Text fontSize={11} {...{ color: "$textSecondary" as any }}>
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
            <User size={24} {...{ color: "$textSecondary" as any }} />
            <Text fontSize={11} {...{ color: "$textSecondary" as any }}>
              Profile
            </Text>
          </Button>
        </Row>
      </Column>
    </Column>
  );
}

