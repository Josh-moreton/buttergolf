'use client'

import { YStack, H1, H3, Button, XStack } from '@buttergolf/ui'
import { SearchBar } from './SearchBar'

export function HeroSection() {
  return (
    <YStack
      backgroundColor="$background"
      paddingVertical="$8"
      paddingHorizontal="$4"
      alignItems="center"
      gap="$4"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
    >
      <YStack alignItems="center" gap="$3" maxWidth={800}>
        <H1 size="$10" textAlign="center" fontWeight="700">
          Ready to declutter your golf bag?
        </H1>
        <H3 size="$6" textAlign="center" opacity={0.7} fontWeight="400">
          Buy and sell pre-owned golf equipment with ease
        </H3>
      </YStack>

      <SearchBar />

      <XStack gap="$3" flexWrap="wrap" justifyContent="center">
        <Button size="$4" theme="blue" borderRadius="$10">
          Sell now
        </Button>
        <Button
          size="$4"
          variant="outlined"
          borderRadius="$10"
          borderColor="$blue10"
        >
          Learn how it works
        </Button>
      </XStack>
    </YStack>
  )
}
