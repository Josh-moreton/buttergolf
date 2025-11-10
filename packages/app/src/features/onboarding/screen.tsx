"use client";

import React, { useEffect, useRef } from "react";
import { Platform, Dimensions, Animated, Easing } from "react-native";
import { Text, Button, YStack, Image, View } from "@buttergolf/ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_W } = Dimensions.get("window");

// Grid configuration for 2 rows x 3 columns (Vinted style)
const CARDS_PER_ROW = 3;
const HORIZONTAL_PADDING = 16; // Side padding
const GAP = 8; // Grid gap
const AVAILABLE_WIDTH =
  SCREEN_W - HORIZONTAL_PADDING * 2 - GAP * (CARDS_PER_ROW - 1);
const CARD_WIDTH = Math.round(AVAILABLE_WIDTH / CARDS_PER_ROW);
const CARD_HEIGHT = Math.round(CARD_WIDTH * 1.2); // 1:1.2 ratio like Vinted

// Golf equipment images for the carousel
const images = [
  {
    id: "clubs-1",
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    source: require("../../../../../apps/mobile/assets/clubs-1.jpg"),
    label: "Golf Clubs Set",
  },
  {
    id: "clubs-2",
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    source: require("../../../../../apps/mobile/assets/clubs-2.webp"),
    label: "Premium Irons",
  },
  {
    id: "clubs-3",
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    source: require("../../../../../apps/mobile/assets/clubs-3.webp"),
    label: "Driver Collection",
  },
  {
    id: "clubs-4",
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    source: require("../../../../../apps/mobile/assets/clubs-4.jpg"),
    label: "Vintage Woods",
  },
  {
    id: "clubs-5",
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    source: require("../../../../../apps/mobile/assets/clubs-5.webp"),
    label: "Putter Selection",
  },
  {
    id: "clubs-6",
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    source: require("../../../../../apps/mobile/assets/clubs-6.jpg"),
    label: "Complete Set",
  },
] as const;

interface OnboardingScreenProps {
  onSkip?: () => void;
  onSignUp?: () => void;
  onSignIn?: () => void;
  onAbout?: () => void;
}

export function OnboardingScreen({
  onSkip,
  onSignUp,
  onSignIn,
  onAbout,
}: Readonly<OnboardingScreenProps>) {
  const insets = useSafeAreaInsets();

  // Animation for gentle horizontal scroll
  // eslint-disable-next-line react-hooks/refs
  const translateXRow1 = useRef(new Animated.Value(0)).current;
  // eslint-disable-next-line react-hooks/refs
  const translateXRow2 = useRef(new Animated.Value(-CARD_WIDTH / 2)).current; // Offset second row

  // Duplicate images for seamless loop - different order for each row
  const itemsRow1 = [...images, ...images];
  const itemsRow2 = [
    images[3],
    images[4],
    images[5],
    images[0],
    images[1],
    images[2],
    images[3],
    images[4],
    images[5],
    images[0],
    images[1],
    images[2],
  ];
  const singleWidth = images.length * (CARD_WIDTH + GAP);

  useEffect(() => {
    // Doubled duration for slower, more relaxed movement (36-40 seconds)
    const duration = Math.max(36000, Math.floor(singleWidth * 48));

    // First row animation
    const animationRow1 = Animated.loop(
      Animated.timing(translateXRow1, {
        toValue: -singleWidth,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Second row animation (same speed, offset start)
    const animationRow2 = Animated.loop(
      Animated.timing(translateXRow2, {
        toValue: -singleWidth - CARD_WIDTH / 2,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animationRow1.start();
    animationRow2.start();

    return () => {
      animationRow1.stop();
      animationRow2.stop();
    };
    // eslint-disable-next-line react-hooks/refs
  }, [singleWidth, translateXRow1, translateXRow2]);

  return (
    <YStack
      flex={1}
      backgroundColor="$primary" // Brand butter orange background
      paddingTop={insets.top}
      paddingBottom={insets.bottom}
    >
      {/* Skip Button - Plain Text */}
      <YStack
        paddingHorizontal={HORIZONTAL_PADDING}
        paddingTop="$sm"
        paddingBottom="$sm"
      >
        <Text
          fontSize={15}
          color="$textMuted"
          fontWeight="400"
          alignSelf="flex-end"
          onPress={onSkip}
          cursor="pointer"
          pressStyle={{
            color: "$textSecondary",
          }}
        >
          Skip
        </Text>
      </YStack>

      {/* Scrolling Image Grid - 2 Rows (Vinted style) */}
      <YStack paddingTop={48} paddingBottom={32} gap={GAP}>
        {/* First Row - Scrolling */}
        <View height={CARD_HEIGHT} overflow="hidden">
          <Animated.View
            style={{
              flexDirection: "row",
              transform: [{ translateX: translateXRow1 }],
            }}
          >
            {itemsRow1.map((item, index) => (
              <View
                key={`row1-${item.id}-${index}`}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                borderRadius={16}
                overflow="hidden"
                marginRight={GAP}
                backgroundColor="$gray200"
              >
                <Image
                  source={item.source}
                  width={CARD_WIDTH}
                  height={CARD_HEIGHT}
                  style={{ objectFit: "cover" }}
                  accessible={true}
                  accessibilityLabel={item.label}
                />
              </View>
            ))}
          </Animated.View>
        </View>

        {/* Second Row - Scrolling (offset start) */}
        <View height={CARD_HEIGHT} overflow="hidden">
          <Animated.View
            style={{
              flexDirection: "row",
              transform: [{ translateX: translateXRow2 }],
            }}
          >
            {itemsRow2.map((item, index) => (
              <View
                key={`row2-${item.id}-${index}`}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                borderRadius={16}
                overflow="hidden"
                marginRight={GAP}
                backgroundColor="$gray200"
              >
                <Image
                  source={item.source}
                  width={CARD_WIDTH}
                  height={CARD_HEIGHT}
                  style={{ objectFit: "cover" }}
                  accessible={true}
                  accessibilityLabel={item.label}
                />
              </View>
            ))}
          </Animated.View>
        </View>
      </YStack>

      <YStack flex={1} />

      {/* Content Section */}
      <YStack
        gap={32}
        paddingHorizontal={HORIZONTAL_PADDING}
        paddingBottom={20}
        alignItems="center"
      >
        {/* Headline and Subtext */}
        <YStack gap={8} alignItems="center" paddingHorizontal={16}>
          <Text
            fontSize={28}
            fontWeight="600"
            textAlign="center"
            color="$text"
            lineHeight={33.6}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fontFamily={(Platform.OS === "ios" ? "Georgia" : "serif") as any}
          >
            From old clubs to new rounds
          </Text>
          <Text
            fontSize={16}
            fontWeight="400"
            textAlign="center"
            color="$textSecondary"
            lineHeight={22}
          >
            Buy, sell, and play smarter
          </Text>
        </YStack>

        {/* CTAs */}
        <YStack gap={12} width="100%" paddingHorizontal={24}>
          {/* Primary CTA - Sign Up */}
          <Button
            onPress={onSignUp}
            variant="solid"
            size="lg"
            fullWidth
          >
            <Text fontSize={17} fontWeight="600" color="#FFFFFF">
              Sign up to Butter Golf
            </Text>
          </Button>

          {/* Secondary CTA - Sign In */}
          <Button
            onPress={onSignIn}
            variant="outline"
            size="lg"
            fullWidth
          >
            <Text fontSize={17} fontWeight="600" color="#E25F2F">
              I already have an account
            </Text>
          </Button>
        </YStack>

        {/* Footer Link - Plain Text */}
        <Text
          fontSize={13}
          color="$textMuted"
          textAlign="center"
          textDecorationLine="underline"
          onPress={onAbout}
          cursor="pointer"
          pressStyle={{
            color: "$textSecondary",
          }}
        >
          About Butter Golf: Our platform
        </Text>
      </YStack>
    </YStack>
  );
}
