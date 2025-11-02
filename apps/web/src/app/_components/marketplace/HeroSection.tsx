"use client"

import { Button, Text, YStack, XStack, Card, Image } from "@buttergolf/ui"

export function HeroSection() {
  return (
    <YStack backgroundColor="$background" paddingVertical="$10">
      <YStack maxWidth={1200} marginHorizontal="auto" paddingHorizontal="$4">
        <XStack
          $sm={{ flexDirection: "column" }}
          $lg={{ flexDirection: "row" }}
          gap="$6"
          alignItems="center"
        >
          <YStack flex={1} gap="$4">
            <Text fontSize="$10" fontWeight="800" lineHeight={44}>
              Buy & sell golf clubs peer‑to‑peer
            </Text>
            <Text color="$color" fontSize="$6">
              Find great deals on drivers, irons, putters and more — or list your
              gear in minutes.
            </Text>
            <XStack gap="$3" flexWrap="wrap">
              <Button size="$5">Browse listings</Button>
              <Button size="$5" variant="outlined">Sell your clubs</Button>
            </XStack>
          </YStack>

          <YStack flex={1} gap="$4">
            <Card backgroundColor="$background" padding="$0">
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=1200" }}
                width="100%"
                height={260}
                resizeMode="cover"
                borderRadius="$4"
              />
            </Card>
            <XStack gap="$4" $sm={{ flexDirection: "column" }} $md={{ flexDirection: "row" }}>
              <Card flex={1} padding="$4">
                <Text fontWeight="700">Featured</Text>
                <Text color="$color">Hot deals this week</Text>
              </Card>
              <Card flex={1} padding="$4">
                <Text fontWeight="700">Fast listing</Text>
                <Text color="$color">Create a post in 60 seconds</Text>
              </Card>
            </XStack>
          </YStack>
        </XStack>
      </YStack>
    </YStack>
  )
}
