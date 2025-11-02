'use client'

import { YStack, H1, H3, Button, XStack, Theme } from '@buttergolf/ui'
import { SearchBar } from './SearchBar'

export function HeroSection() {
  return (
    <YStack
      backgroundColor="$color1"
      paddingVertical="$8"
      paddingHorizontal="$4"
      alignItems="center"
      gap="$4"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
    >
      <YStack alignItems="center" gap="$3" maxWidth={800}>
        <H1 size="$10" textAlign="center" fontWeight="700" color="$color12">
          Ready to declutter your golf bag?
        </H1>
        <H3 size="$6" textAlign="center" color="$color11" fontWeight="400">
          Buy and sell pre-owned golf equipment with ease
        </H3>
      </YStack>

      <SearchBar />

      <XStack gap="$3" flexWrap="wrap" justifyContent="center">
        <Button 
          size="$4" 
          backgroundColor="$color9" 
          color="$background"
          borderRadius="$10"
          hoverStyle={{ backgroundColor: '$color10' }}
          pressStyle={{ backgroundColor: '$color11' }}
        >
          Sell now
        </Button>
        <Theme name="amber">
          <Button
            size="$4"
            backgroundColor="$color9"
            color="$color12"
            borderRadius="$10"
            hoverStyle={{ backgroundColor: '$color10' }}
            pressStyle={{ backgroundColor: '$color11' }}
          >
            Learn how it works
          </Button>
        </Theme>
      </XStack>
    </YStack>
  )
}
