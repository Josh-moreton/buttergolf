'use client'

import { YStack, H1, H3, Button, XStack } from '@buttergolf/ui'
import { SearchBar } from './SearchBar'

export function HeroSection() {
  return (
    <YStack
      backgroundColor="$surface"
      paddingVertical="$8"
      paddingHorizontal="$4"
      alignItems="center"
      {...{ gap: "lg" as any }}
      borderBottomWidth={1}
      borderBottomColor="$border"
    >
      <YStack alignItems="center" {...{ gap: "sm" as any }} maxWidth={800}>
        <H1 size="$10" textAlign="center" fontWeight="700" color="$text">
          Ready to declutter your golf bag?
        </H1>
        <H3 size="$6" textAlign="center" color="$textSecondary" fontWeight="400">
          Buy and sell pre-owned golf equipment with ease
        </H3>
      </YStack>

      <SearchBar />

      <XStack {...{ gap: "sm" as any }} flexWrap="wrap" justifyContent="center">
        <Button 
          size="$4" 
          backgroundColor="$primary" 
          color="$textInverse"
          borderRadius="$10"
          hoverStyle={{ backgroundColor: '$primaryHover' }}
          pressStyle={{ backgroundColor: '$primaryPress' }}
        >
          Sell now
        </Button>
        <Button
          size="$4"
          backgroundColor="$secondary"
          color="$text"
          borderRadius="$10"
          hoverStyle={{ backgroundColor: '$secondaryHover' }}
          pressStyle={{ backgroundColor: '$secondaryPress' }}
        >
          Learn how it works
        </Button>
      </XStack>
    </YStack>
  )
}
