"use client"

import { Text, YStack, XStack } from "@buttergolf/ui"

export function FooterSection() {
  return (
    <YStack paddingVertical="$8" borderTopWidth={1} borderColor="$borderColor">
      <YStack maxWidth={1200} marginHorizontal="auto" paddingHorizontal="$4" gap="$6">
        <XStack gap="$8" $sm={{ flexDirection: "column" }} $md={{ flexDirection: "row" }}>
          <YStack flex={1} gap="$2">
            <Text fontWeight="800">ButterGolf</Text>
            <Text color="$color">Peer‑to‑peer marketplace for golf gear.</Text>
          </YStack>
          <YStack flex={1} gap="$2">
            <Text fontWeight="700">Help</Text>
            <Text color="$color">Support</Text>
            <Text color="$color">Safety</Text>
          </YStack>
          <YStack flex={1} gap="$2">
            <Text fontWeight="700">Company</Text>
            <Text color="$color">About</Text>
            <Text color="$color">Contact</Text>
          </YStack>
        </XStack>
        <Text opacity={0.7}>© {new Date().getFullYear()} ButterGolf</Text>
      </YStack>
    </YStack>
  )
}
