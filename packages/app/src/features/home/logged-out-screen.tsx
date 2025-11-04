"use client";

import React from "react";
import { Dimensions, Platform } from "react-native";
import {
  Column,
  Row,
  ScrollView,
  Input,
  Button,
  Text,
  Card,
  Image,
  View,
  YStack,
} from "@buttergolf/ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search, Camera } from "@tamagui/lucide-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Mock data for product grid
const MOCK_PRODUCTS = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400",
    title: "Jellycat",
    size: "M",
    condition: "Very good",
    price: 70.5,
    likes: 11,
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
    title: "Brandy Melville",
    size: "S / 8",
    condition: "Very good",
    price: 8.58,
    likes: 8,
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400",
    title: "TaylorMade Driver",
    size: "10.5°",
    condition: "Excellent",
    price: 299.99,
    likes: 15,
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400",
    title: "Tommy Hilfiger",
    size: "L",
    condition: "Good",
    price: 45.0,
    likes: 12,
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1530028828-25e8270e98f3?w=400",
    title: "Scotty Cameron",
    size: "34 inch",
    condition: "Like new",
    price: 249.99,
    likes: 23,
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400",
    title: "Titleist Pro V1",
    size: "Dozen",
    condition: "New",
    price: 39.99,
    likes: 9,
  },
];

const CATEGORIES = [
  "All",
  "Women",
  "Men",
  "Designer",
  "Kids",
  "Home",
  "Electronics",
  "Golf",
];

interface LoggedOutHomeScreenProps {
  onSignIn?: () => void;
}

export function LoggedOutHomeScreen({
  onSignIn,
}: Readonly<LoggedOutHomeScreenProps>) {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  // Calculate card dimensions (2 columns with gap)
  const gap = 8;
  const horizontalPadding = 16;
  const cardWidth = (SCREEN_WIDTH - horizontalPadding * 2 - gap) / 2;

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
            <Search size={20} color="$textMuted" />
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
            <Camera size={24} color="$vintedTeal" />
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
              selectedCategory === category ? "$vintedTeal" : "$white"
            }
            borderWidth={1}
            borderColor={
              selectedCategory === category ? "$vintedTeal" : "$border"
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

      {/* Warning Banner (optional - matches Vinted) */}
      <Column
        backgroundColor="$warning"
        paddingVertical="$3"
        paddingHorizontal="$4"
        marginHorizontal="$4"
        marginBottom="$3"
        borderRadius="$md"
      >
        <Row gap="$2" alignItems="flex-start">
          <Text fontSize={20}>⚠️</Text>
          <Text fontSize={13} color="$text" flex={1} lineHeight={18}>
            Sorry, your earnings might stay in pending balance longer than
            usual. We're working on it!
          </Text>
        </Row>
      </Column>

      {/* Product Grid */}
      <ScrollView
        flex={1}
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingBottom: insets.bottom + 80,
        }}
      >
        <Row flexWrap="wrap" gap={gap}>
          {MOCK_PRODUCTS.map((product) => (
            <Card
              key={product.id}
              width={cardWidth}
              padding={0}
              borderRadius="$md"
              overflow="hidden"
              backgroundColor="$white"
              pressStyle={{ scale: 0.98 }}
              animation="quick"
            >
              {/* Product Image */}
              <View width="100%" height={cardWidth * 1.3} position="relative">
                <Image
                  source={{ uri: product.image }}
                  width="100%"
                  height="100%"
                  resizeMode="cover"
                />
                {/* Like Button */}
                <View
                  position="absolute"
                  bottom={8}
                  right={8}
                  backgroundColor="$white"
                  borderRadius="$full"
                  paddingHorizontal={10}
                  paddingVertical={4}
                >
                  <Row alignItems="center" gap={4}>
                    <Text fontSize={14}>❤️</Text>
                    <Text fontSize={13} fontWeight="500">
                      {product.likes}
                    </Text>
                  </Row>
                </View>
              </View>

              {/* Product Info */}
              <Column padding="$2" gap="$1">
                <Text fontSize={14} fontWeight="500" numberOfLines={1}>
                  {product.title}
                </Text>
                <Text fontSize={12} color="$textSecondary">
                  {product.size} · {product.condition}
                </Text>
                <Text fontSize={16} fontWeight="600" color="$vintedTeal">
                  £{product.price.toFixed(2)}
                </Text>
              </Column>
            </Card>
          ))}
        </Row>
      </ScrollView>

      {/* Sticky Footer Banner */}
      <Column
        position="absolute"
        bottom={insets.bottom}
        left={0}
        right={0}
        backgroundColor="$white"
        borderTopWidth={1}
        borderTopColor="$border"
        paddingVertical="$3"
        paddingHorizontal="$4"
      >
        <Row alignItems="center" justifyContent="space-between">
          <Text fontSize={13} color="$textSecondary" flex={1}>
            Shipping fees will be added at checkout
          </Text>
          <Button size="$2" chromeless padding={0} onPress={() => {}}>
            <Text fontSize={20}>✕</Text>
          </Button>
        </Row>
      </Column>

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
      >
        <Row height={60} alignItems="center" justifyContent="space-around">
          <Button
            chromeless
            flexDirection="column"
            gap="$1"
            padding="$2"
            onPress={() => {}}
          >
            <Text fontSize={24}>🏠</Text>
            <Text fontSize={11} color="$vintedTeal" fontWeight="600">
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
            <Text fontSize={24}>🔍</Text>
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
            <Text fontSize={24}>➕</Text>
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
            <Text fontSize={24}>✉️</Text>
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
            <Text fontSize={24}>👤</Text>
            <Text fontSize={11} color="$textSecondary">
              Profile
            </Text>
          </Button>
        </Row>
      </Column>
    </Column>
  );
}
