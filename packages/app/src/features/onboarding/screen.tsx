'use client'

import React, { useEffect } from 'react'
import { Dimensions, Platform, AccessibilityInfo, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated'
import { YStack, XStack, Text, Button, View } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { width: SCREEN_W } = Dimensions.get('window')

const CARD_WIDTH = Math.round(SCREEN_W * 0.28)
const CARD_HEIGHT = Math.round(CARD_WIDTH * 1.33)
const GAP = 12

// Placeholder images with golf equipment themed colors
// In production, these would be actual image requires
const images = [
  { id: 'club', color: '#2c3e50', label: 'Golf Club' },
  { id: 'ball', color: '#ecf0f1', label: 'Golf Ball' },
  { id: 'bag', color: '#34495e', label: 'Golf Bag' },
  { id: 'feet', color: '#95a5a6', label: 'Golf Shoes' },
  { id: 'scooter', color: '#7f8c8d', label: 'Golf Cart' },
  { id: 'accessory', color: '#bdc3c7', label: 'Accessory' },
]

interface OnboardingScreenProps {
  onSkip?: () => void
  onSignUp?: () => void
  onSignIn?: () => void
  onAbout?: () => void
}

export function OnboardingScreen({
  onSkip,
  onSignUp,
  onSignIn,
  onAbout,
}: OnboardingScreenProps) {
  const insets = useSafeAreaInsets()
  const items = [...images, ...images]
  const singleWidth = images.length * (CARD_WIDTH + GAP)
  const translateX = useSharedValue(0)
  const [reduceMotion, setReduceMotion] = React.useState(false)

  useEffect(() => {
    // Check for reduce motion setting
    if (Platform.OS !== 'web') {
      AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
        setReduceMotion(enabled ?? false)
      })
    }
  }, [])

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(translateX)
      return
    }

    const duration = Math.max(18000, Math.floor(singleWidth * 24))
    translateX.value = withRepeat(
      withTiming(-singleWidth, { duration, easing: Easing.linear }),
      -1,
      false
    )

    return () => {
      cancelAnimation(translateX)
    }
  }, [reduceMotion, singleWidth, translateX])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  return (
    <YStack
      flex={1}
      backgroundColor="$bg"
      paddingTop={insets.top}
      paddingBottom={insets.bottom}
    >
      {/* Skip Button */}
      <XStack justifyContent="flex-end" paddingHorizontal="$4" paddingTop="$3">
        <Pressable
          onPress={onSkip}
          accessibilityLabel="Skip onboarding"
          accessibilityRole="button"
        >
          <Text fontSize="$5" color="$muted" fontWeight="500">
            Skip
          </Text>
        </Pressable>
      </XStack>

      {/* Carousel */}
      <YStack flex={1} justifyContent="center" overflow="hidden">
        <View height={CARD_HEIGHT} overflow="hidden">
          <Animated.View style={[{ flexDirection: 'row' }, animatedStyle]}>
            {items.map((item, index) => (
              <View
                key={`${item.id}-${index}`}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                style={{
                  backgroundColor: item.color,
                  marginRight: index !== items.length - 1 ? GAP : 0,
                }}
                borderRadius="$4"
                shadowColor="$shadowColor"
                shadowRadius={8}
                shadowOffset={{ width: 0, height: 4 }}
                accessible
                accessibilityLabel={item.label}
              />
            ))}
          </Animated.View>
        </View>
      </YStack>

      {/* Content Section */}
      <YStack
        gap="$6"
        paddingHorizontal="$6"
        paddingBottom="$4"
        alignItems="center"
      >
        {/* Headline */}
        <Text
          fontSize="$8"
          fontWeight="600"
          textAlign="center"
          color="$text"
          lineHeight="$8"
          style={{ fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' }}
          paddingHorizontal="$4"
        >
          From old clubs to new rounds — buy, sell, and play smarter.
        </Text>

        {/* CTAs */}
        <YStack gap="$3" width="100%" maxWidth={400}>
          <Button
            size="$5"
            backgroundColor="$green500"
            color="white"
            fontWeight="600"
            borderRadius="$4"
            pressStyle={{
              backgroundColor: '$green700',
              scale: 0.98,
            }}
            onPress={onSignUp}
            accessible
            accessibilityLabel="Sign up to Butter Golf"
            accessibilityRole="button"
          >
            Sign up to Butter Golf
          </Button>

          <Button
            size="$5"
            backgroundColor="transparent"
            borderColor="$text"
            borderWidth={2}
            color="$text"
            fontWeight="600"
            borderRadius="$4"
            pressStyle={{
              backgroundColor: '$bg',
              scale: 0.98,
            }}
            onPress={onSignIn}
            accessible
            accessibilityLabel="I already have an account"
            accessibilityRole="button"
          >
            I already have an account
          </Button>
        </YStack>

        {/* Footer */}
        <Pressable
          onPress={onAbout}
          accessibilityLabel="About Butter Golf: Our platform"
          accessibilityRole="button"
        >
          <Text fontSize="$4" color="$muted" textAlign="center">
            About Butter Golf: Our platform
          </Text>
        </Pressable>
      </YStack>
    </YStack>
  )
}
