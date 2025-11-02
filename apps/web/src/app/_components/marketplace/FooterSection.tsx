"use client"

import { Text, XStack, YStack } from "@buttergolf/ui"

export function FooterSection() {
  return (
    <YStack paddingVertical="$8" borderTopWidth={1} borderColor="$border">
      <YStack maxWidth={1200} marginHorizontal="auto" paddingHorizontal="$4" gap="$xl">
        <XStack gap="$$2xl" $sm={{ flexDirection: "column" }} $md={{ flexDirection: "row" }}>
          <YStack flex={1} gap="$xs">
            <Text weight="bold" fontWeight="800">ButterGolf</Text>
            <Text>Peer‑to‑peer marketplace for golf gear.</Text>
          </YStack>
          <YStack flex={1} gap="$xs">
            <Text weight="bold">Help</Text>
            <Text>Support</Text>
            <Text>Safety</Text>
          </YStack>
          <YStack flex={1} gap="$xs">
            <Text weight="bold">Company</Text>
            <Text>About</Text>
            <Text>Contact</Text>
          </YStack>
        </XStack>
        <Text opacity={0.7}>© {new Date().getFullYear()} ButterGolf</Text>
      </YStack>
    </YStack>
  )
}
