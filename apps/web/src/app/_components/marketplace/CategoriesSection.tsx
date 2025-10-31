"use client"

import { Button, Text, YStack, XStack, ScrollView, Card } from "@buttergolf/ui"

const CATEGORIES = [
  { key: "drivers", label: "Drivers" },
  { key: "woods", label: "Fairway Woods" },
  { key: "hybrids", label: "Hybrids" },
  { key: "irons", label: "Irons" },
  { key: "wedges", label: "Wedges" },
  { key: "putters", label: "Putters" },
  { key: "bags", label: "Bags" },
  { key: "balls", label: "Balls" },
  { key: "accessories", label: "Accessories" },
]

export function CategoriesSection() {
  return (
    <YStack paddingVertical="$6">
      <YStack maxWidth={1200} marginHorizontal="auto" paddingHorizontal="$4" gap="$4">
        <Text fontSize="$8" fontWeight="700">Shop by category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack gap="$3" paddingVertical="$2">
            {CATEGORIES.map((c) => (
              <Card key={c.key} padding="$4" borderRadius="$4">
                <Button size="$3" variant="outlined">
                  {c.label}
                </Button>
              </Card>
            ))}
          </XStack>
        </ScrollView>
      </YStack>
    </YStack>
  )
}
