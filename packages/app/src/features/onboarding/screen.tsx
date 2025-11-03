"use client";

import React, { useEffect, useRef } from "react";
import {
  Platform,
  Dimensions,
  AccessibilityInfo,
  Animated,
  Easing,
} from "react-native";
import { Text, Button, YStack, Image, View } from "@buttergolf/ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_W } = Dimensions.get("window");

const CARD_WIDTH = Math.round(SCREEN_W * 0.32);
const CARD_HEIGHT = Math.round(CARD_WIDTH * 1.4);
const GAP = 12;

// Golf equipment images for the carousel
const images = [
  {
    id: "clubs-1",
    source: require("../../../../../apps/mobile/assets/clubs-1.jpg"),
    label: "Golf Clubs Set",
  },
  {
    id: "clubs-2",
    source: require("../../../../../apps/mobile/assets/clubs-2.webp"),
    label: "Premium Irons",
  },
  {
    id: "clubs-3",
    source: require("../../../../../apps/mobile/assets/clubs-3.webp"),
    label: "Driver Collection",
  },
  {
    id: "clubs-4",
    source: require("../../../../../apps/mobile/assets/clubs-4.jpg"),
    label: "Vintage Woods",
  },
  {
    id: "clubs-5",
    source: require("../../../../../apps/mobile/assets/clubs-5.webp"),
    label: "Putter Selection",
  },
  {
    id: "clubs-6",
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

  // Duplicate images array for seamless infinite loop
  const items = [...images, ...images];
  const singleWidth = images.length * (CARD_WIDTH + GAP);
  const translateX = useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = React.useState(false);

  useEffect(() => {
    // Check for reduce motion setting
    if (Platform.OS !== "web") {
      AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
        setReduceMotion(enabled ?? false);
      });
    }
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      translateX.stopAnimation();
      return;
    }

    // Gentle 18-20 second scroll duration for smooth, relaxed movement
    const duration = Math.max(18000, Math.floor(singleWidth * 24));

    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: -singleWidth,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [reduceMotion, singleWidth, translateX]);

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      paddingTop={insets.top}
      paddingBottom={insets.bottom}
    >
      {/* Auto-scrolling Product Carousel with Real Images */}
      <YStack flex={1} justifyContent="center" paddingVertical="$8">
        <View height={CARD_HEIGHT} overflow="hidden">
          <Animated.View
            style={{ flexDirection: "row", transform: [{ translateX }] }}
          >
            {items.map((item, index) => (
              <View
                key={`${item.id}-${index}`}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                borderRadius="$lg"
                overflow="hidden"
                marginRight={index < items.length - 1 ? GAP : 0}
                backgroundColor="$gray200"
                {...({
                  shadowColor: "#000",
                  shadowRadius: 16,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.18,
                  elevation: 12,
                } as any)}
              >
                <Image
                  source={item.source}
                  width="100%"
                  height="100%"
                  resizeMode="cover"
                  accessible={true}
                  accessibilityLabel={item.label}
                />
              </View>
            ))}
          </Animated.View>
        </View>
        <Text
          fontSize="$2"
          color="$textSecondary"
          marginTop="$5"
          textAlign="center"
          fontWeight="500"
        >
          Browse thousands of pre-loved golf items
        </Text>
      </YStack>{" "}
      {/* Content Section */}
      <YStack
        gap="$lg"
        paddingHorizontal="$6"
        paddingBottom="$4"
        alignItems="center"
      >
        {/* Headline */}
        <YStack gap="$xs" paddingHorizontal="$5">
          <Text
            fontSize="$9"
            fontWeight="700"
            textAlign="center"
            color="$text"
            lineHeight={36}
            fontFamily={(Platform.OS === "ios" ? "Georgia" : "serif") as any}
          >
            From old clubs to new rounds
          </Text>
          <Text
            fontSize="$5"
            fontWeight="500"
            textAlign="center"
            color="$textSecondary"
            lineHeight={22}
          >
            Buy, sell, and play smarter
          </Text>
        </YStack>

        {/* CTAs */}
        <YStack gap="$sm" width="100%" maxWidth={420} paddingHorizontal="$5">
          <Button
            size="$5"
            height={56}
            backgroundColor="$primary"
            borderRadius={16}
            pressStyle={{
              backgroundColor: "$primaryPress",
              scale: 0.97,
              opacity: 0.9,
            }}
            onPress={onSignUp}
            aria-label="Sign up to Butter Golf"
            style={{
              shadowColor: "$primary",
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
            }}
          >
            <Text color="$textInverse" fontSize="$6" fontWeight="700">
              Sign up to Butter Golf
            </Text>
          </Button>

          <Button
            size="$5"
            height={56}
            backgroundColor="transparent"
            borderColor="$border"
            borderWidth={2}
            borderRadius={16}
            pressStyle={{
              backgroundColor: "$backgroundHover",
              scale: 0.97,
            }}
            onPress={onSignIn}
            aria-label="I already have an account"
          >
            <Text color="$text" fontSize="$5" fontWeight="600">
              I already have an account
            </Text>
          </Button>
        </YStack>

        {/* Footer */}
        <Button
          unstyled
          onPress={onAbout}
          padding="$3"
          aria-label="About Butter Golf: Our platform"
        >
          <Text fontSize="$4" color="$textSecondary" textAlign="center">
            About Butter Golf: Our platform
          </Text>
        </Button>
      </YStack>
    </YStack>
  );
}
