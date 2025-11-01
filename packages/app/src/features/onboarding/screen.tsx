'use client'

import React, { useEffect, useRef } from 'react'
import { Platform, Dimensions, AccessibilityInfo, Animated, Easing } from 'react-native'
import { YStack, Text, Button, View } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { width: SCREEN_W } = Dimensions.get('window')

const CARD_WIDTH = Math.round(SCREEN_W * 0.32)
const CARD_HEIGHT = Math.round(CARD_WIDTH * 1.4)
const GAP = 12

// Premium placeholder cards with golf equipment themed colors
// Carefully chosen palette for visual appeal
const images = [
  { id: 'club', color: '#2d3436', label: 'Golf Club' },
  { id: 'ball', color: '#dfe6e9', label: 'Golf Ball' },
  { id: 'bag', color: '#636e72', label: 'Golf Bag' },
  { id: 'shoes', color: '#b2bec3', label: 'Golf Shoes' },
  { id: 'cart', color: '#74b9ff', label: 'Golf Cart' },
  { id: 'gloves', color: '#a29bfe', label: 'Golf Gloves' },
] as const

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
  
  // Duplicate images array for seamless infinite loop
  const items = [...images, ...images]
  const singleWidth = images.length * (CARD_WIDTH + GAP)
  const translateX = useRef(new Animated.Value(0)).current
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
      translateX.stopAnimation()
      return
    }

    // Gentle 18-20 second scroll duration
    const duration = Math.max(18000, Math.floor(singleWidth * 24))
    
    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: -singleWidth,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    )
    
    animation.start()

    return () => {
      animation.stop()
    }
  }, [reduceMotion, singleWidth, translateX])

  return (
    <YStack
      flex={1}
      backgroundColor="$bg"
      paddingTop={insets.top}
      paddingBottom={insets.bottom}
    >
      {/* Auto-scrolling Product Carousel */}
      <YStack flex={1} justifyContent="center" paddingVertical="$8">
        <View height={CARD_HEIGHT} overflow="hidden">
          <Animated.View style={{ flexDirection: 'row', transform: [{ translateX }] }}>
            {items.map((item, index) => (
              <View
                key={`${item.id}-${index}`}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                borderRadius={18}
                style={{
                  backgroundColor: item.color,
                  marginRight: index < items.length - 1 ? GAP : 0,
                  shadowColor: '#000',
                  shadowRadius: 16,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.18,
                  elevation: 12,
                }}
              />
            ))}
          </Animated.View>
        </View>
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
            <Text color="white" fontSize="$6" fontWeight="700">
              Sign up to Butter Golf
            </Text>
          </Button>

          <Button
            size="$5"
            height={56}
            backgroundColor="transparent"
            borderColor="$text"
            borderWidth={2}
            borderRadius={16}
            pressStyle={{
              backgroundColor: 'rgba(15, 23, 32, 0.04)',
              scale: 0.97,
            }}
            onPress={onSignIn}
            // eslint-disable-next-line deprecation/deprecation
            accessibilityLabel="I already have an account"
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
          // eslint-disable-next-line deprecation/deprecation
          accessibilityLabel="About Butter Golf: Our platform"
        >
          <Text fontSize="$4" color="$muted" textAlign="center">
            About Butter Golf: Our platform
          </Text>
        </Button>
      </YStack>
    </YStack>
  )
}
