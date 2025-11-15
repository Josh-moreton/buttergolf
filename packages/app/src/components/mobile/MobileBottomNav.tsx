"use client";

import React from "react";
import { Row, Column, Text } from "@buttergolf/ui";
import { Home, Heart, PlusCircle, MessageCircle, User } from "@tamagui/lucide-icons";

export interface MobileBottomNavProps {
  activeTab?: "home" | "wishlist" | "sell" | "messages" | "login";
  onHomePress?: () => void;
  onWishlistPress?: () => void;
  onSellPress?: () => void;
  onMessagesPress?: () => void;
  onLoginPress?: () => void;
}

/**
 * Mobile bottom navigation with 5 tabs: Home, Wishlist, Sell, Messages, Login.
 * Features curved top corners and drop shadow matching the top search bar.
 */
export function MobileBottomNav({
  activeTab = "home",
  onHomePress,
  onWishlistPress,
  onSellPress,
  onMessagesPress,
  onLoginPress,
}: Readonly<MobileBottomNavProps>) {
  return (
    <Column
      backgroundColor="$background"
      borderTopLeftRadius="$2xl"
      borderTopRightRadius="$2xl"
      shadowColor="rgba(0, 0, 0, 0.15)"
      shadowOffset={{ width: 0, height: -4 }}
      shadowOpacity={1}
      shadowRadius={8}
      elevation={8}
      paddingTop="$3"
      paddingBottom="$6"
    >
      <Row alignItems="center" justifyContent="space-around" paddingHorizontal="$4">
        {/* Home */}
        <Column
          gap="$1"
          alignItems="center"
          minWidth={60}
          onPress={onHomePress}
          cursor="pointer"
          accessibilityRole="button"
          accessibilityLabel="Home"
          accessibilityState={{ selected: activeTab === "home" }}
        >
          <Home
            size={24}
            color={activeTab === "home" ? "$spicedClementine" : "$ironstone"}
            opacity={activeTab === "home" ? 1 : 0.5}
          />
          <Text
            fontSize={11}
            color="$ironstone"
            opacity={activeTab === "home" ? 1 : 0.5}
            fontWeight={activeTab === "home" ? "600" : "400"}
          >
            Home
          </Text>
        </Column>

        {/* Wishlist */}
        <Column
          gap="$1"
          alignItems="center"
          minWidth={60}
          onPress={onWishlistPress}
          cursor="pointer"
          accessibilityRole="button"
          accessibilityLabel="Wishlist"
          accessibilityState={{ selected: activeTab === "wishlist" }}
        >
          <Heart
            size={24}
            color={activeTab === "wishlist" ? "$spicedClementine" : "$ironstone"}
            opacity={activeTab === "wishlist" ? 1 : 0.5}
          />
          <Text
            fontSize={11}
            color="$ironstone"
            opacity={activeTab === "wishlist" ? 1 : 0.5}
            fontWeight={activeTab === "wishlist" ? "600" : "400"}
          >
            Wishlist
          </Text>
        </Column>

        {/* Sell */}
        <Column
          gap="$1"
          alignItems="center"
          minWidth={60}
          onPress={onSellPress}
          cursor="pointer"
          accessibilityRole="button"
          accessibilityLabel="Sell"
          accessibilityState={{ selected: activeTab === "sell" }}
        >
          <PlusCircle
            size={24}
            color={activeTab === "sell" ? "$spicedClementine" : "$ironstone"}
            opacity={activeTab === "sell" ? 1 : 0.5}
          />
          <Text
            fontSize={11}
            color="$ironstone"
            opacity={activeTab === "sell" ? 1 : 0.5}
            fontWeight={activeTab === "sell" ? "600" : "400"}
          >
            Sell
          </Text>
        </Column>

        {/* Messages */}
        <Column
          gap="$1"
          alignItems="center"
          minWidth={60}
          onPress={onMessagesPress}
          cursor="pointer"
          accessibilityRole="button"
          accessibilityLabel="Messages"
          accessibilityState={{ selected: activeTab === "messages" }}
        >
          <MessageCircle
            size={24}
            color={activeTab === "messages" ? "$spicedClementine" : "$ironstone"}
            opacity={activeTab === "messages" ? 1 : 0.5}
          />
          <Text
            fontSize={11}
            color="$ironstone"
            opacity={activeTab === "messages" ? 1 : 0.5}
            fontWeight={activeTab === "messages" ? "600" : "400"}
          >
            Messages
          </Text>
        </Column>

        {/* Login */}
        <Column
          gap="$1"
          alignItems="center"
          minWidth={60}
          onPress={onLoginPress}
          cursor="pointer"
          accessibilityRole="button"
          accessibilityLabel="Log in"
          accessibilityState={{ selected: activeTab === "login" }}
        >
          <User
            size={24}
            color={activeTab === "login" ? "$spicedClementine" : "$ironstone"}
            opacity={activeTab === "login" ? 1 : 0.5}
          />
          <Text
            fontSize={11}
            color="$ironstone"
            opacity={activeTab === "login" ? 1 : 0.5}
            fontWeight={activeTab === "login" ? "600" : "400"}
          >
            Log-in
          </Text>
        </Column>
      </Row>
    </Column>
  );
}
