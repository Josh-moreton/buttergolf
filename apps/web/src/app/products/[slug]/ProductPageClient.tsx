"use client"

import Link from "next/link"
import { YStack, XStack, Text, Image, Button, Card } from "@buttergolf/ui"

export default function ProductPageClient({
  product,
  slug,
}: Readonly<{ product: any; slug: string }>) {
  return (
    <YStack paddingTop="$16" backgroundColor="$bgGray">
      <YStack maxWidth={1200} marginHorizontal="auto" paddingHorizontal="$4" paddingVertical="$6" gap="$4">
        {/* Breadcrumbs */}
        <XStack gap="$2" alignItems="center">
          <Link href="/" style={{ textDecoration: "none" }}>
            <Text color="$blue" hoverStyle={{ color: "$blueLight" }}>Home</Text>
          </Link>
          <Text opacity={0.5}>/</Text>
          <Link href="/products" style={{ textDecoration: "none" }}>
            <Text color="$blue" hoverStyle={{ color: "$blueLight" }}>Products</Text>
          </Link>
          <Text opacity={0.5}>/</Text>
          <Text fontWeight="700">{product.title}</Text>
        </XStack>

        <XStack gap="$6" flexDirection="column" $xl={{ flexDirection: "row" }}>
          {/* Left: Image */}
          <Card flexBasis="0%" $xl={{ flex: 1 }} overflow="hidden" bordered elevate>
            <Image source={{ uri: product.image }} width="100%" height={520} objectFit="cover" />
          </Card>

          {/* Right: Details */}
          <YStack flexBasis="0%" $xl={{ flex: 1 }} gap="$4">
            <Text fontSize="$9" fontWeight="800">{product.title}</Text>
            <XStack gap="$3" alignItems="center">
              <Text fontSize="$8" fontWeight="800">£{product.price}</Text>
              <Text opacity={0.6}>{String(product.condition).replace("_", " ")}</Text>
            </XStack>
            <Text opacity={0.8}>{product.description}</Text>

            <XStack gap="$3">
              <Button size="$4">Add to cart</Button>
              <Button size="$4" variant="outlined">Add to wishlist</Button>
            </XStack>

            <YStack gap="$2">
              <Text fontWeight="700">Specifications</Text>
              <Text opacity={0.8}>• Shaft: Regular flex\n• Grip: Standard\n• Hand: Right</Text>
            </YStack>
          </YStack>
        </XStack>
      </YStack>
    </YStack>
  )
}
