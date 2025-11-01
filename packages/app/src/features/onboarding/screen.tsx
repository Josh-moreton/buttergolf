'use client'

import React from 'react'
import { Dimensions, Platform, Pressable, ScrollView } from 'react-native'
import { YStack, XStack, Text, Button, View } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { width: SCREEN_W } = Dimensions.get('window')

const CARD_WIDTH = Math.round(SCREEN_W * 0.32)
const CARD_HEIGHT = Math.round(CARD_WIDTH * 1.4)

// Premium placeholder cards with golf equipment themed colors
// Carefully chosen palette for visual appeal
const images = [
  { id: 'club', color: '#2d3436', label: 'Golf Club' },
  { id: 'ball', color: '#dfe6e9', label: 'Golf Ball' },
  { id: 'bag', color: '#636e72', label: 'Golf Bag' },
  { id: 'shoes', color: '#b2bec3', label: 'Golf Shoes' },
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
}: Readonly<OnboardingScreenProps>) {
  const insets = useSafeAreaInsets()
  // Show a subset of cards for clean, premium look (no animation for Expo Go compat)
  const displayItems = images.slice(0, 4)

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
          // eslint-disable-next-line deprecation/deprecation
          accessibilityLabel="Skip onboarding"
          accessibilityRole="button"
        >
          <Text fontSize="$5" color="$muted" fontWeight="500">
            Skip
          </Text>
        </Pressable>
      </XStack>

      {/* Product Showcase - Premium static carousel */}
      <YStack flex={1} justifyContent="center" alignItems="center" paddingVertical="$8">
        <XStack gap="$3" paddingHorizontal="$5">
          {displayItems.map((item) => (
            <View
              key={item.id}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              borderRadius={18}
              style={{
                backgroundColor: item.color,
                shadowColor: '#000',
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.18,
                elevation: 12,
              }}
            />
          ))}
        </XStack>
        <Text
          fontSize="$2"
          color="$muted"
          marginTop="$5"
          textAlign="center"
          fontWeight="500"
        >
          Browse thousands of pre-loved golf items
        </Text>
      </YStack>      {/* Content Section */}
      <YStack
        gap="$6"
        paddingHorizontal="$6"
        paddingBottom="$4"
        alignItems="center"
      >
        {/* Headline */}
        <YStack gap="$2" paddingHorizontal="$5">
          <Text
            fontSize="$9"
            fontWeight="700"
            textAlign="center"
            color="$text"
            lineHeight={36}
            fontFamily={(Platform.OS === 'ios' ? 'Georgia' : 'serif') as any}
          >
            From old clubs to new rounds
          </Text>
          <Text
            fontSize="$5"
            fontWeight="500"
            textAlign="center"
            color="$muted"
            lineHeight={22}
          >
            Buy, sell, and play smarter
          </Text>
        </YStack>

        {/* CTAs */}
        <YStack gap="$3" width="100%" maxWidth={420} paddingHorizontal="$5">
          <Button
            size="$5"
            height={56}
            backgroundColor="$green500"
            color="white"
            fontSize="$6"
            fontWeight="700"
            borderRadius={16}
            pressStyle={{
              backgroundColor: '$green700',
              scale: 0.97,
              opacity: 0.9,
            }}
            onPress={onSignUp}
            // eslint-disable-next-line deprecation/deprecation
            accessibilityLabel="Sign up to Butter Golf"
            style={{
              shadowColor: '$green500',
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
            }}
          >
            Sign up to Butter Golf
          </Button>

          <Button
            size="$5"
            height={56}
            backgroundColor="transparent"
            borderColor="$text"
            borderWidth={2}
            color="$text"
            fontSize="$5"
            fontWeight="600"
            borderRadius={16}
            pressStyle={{
              backgroundColor: 'rgba(15, 23, 32, 0.04)',
              scale: 0.97,
            }}
            onPress={onSignIn}
            // eslint-disable-next-line deprecation/deprecation
            accessibilityLabel="I already have an account"
          >
            I already have an account
          </Button>
        </YStack>

        {/* Footer */}
        <Pressable
          onPress={onAbout}
          // eslint-disable-next-line deprecation/deprecation
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
