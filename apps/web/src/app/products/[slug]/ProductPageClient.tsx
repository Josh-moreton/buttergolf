"use client"

import Link from "next/link"
import { XStack, YStack, Text, Image, Button, Card } from "@buttergolf/ui"

export default function ProductPageClient({
  product,
  slug,
}: Readonly<{ product: any; slug: string }>) {
  return (
    <YStack paddingTop="$16" backgroundColor="$background">
      <YStack maxWidth={1200} marginHorizontal="auto" paddingHorizontal="$4" paddingVertical="$6" gap="$lg">
        {/* Breadcrumbs */}
        <XStack gap="$xs" alignItems="center">
          <Link href="/" style={{ textDecoration: "none" }}>
            <Text color="$info" hoverStyle={{ color: "$infoLight" as any }}>Home</Text>
          </Link>
          <Text color="$textMuted">/</Text>
          <Link href="/products" style={{ textDecoration: "none" }}>
            <Text color="$info" hoverStyle={{ color: "$infoLight" as any }}>Products</Text>
          </Link>
          <Text color="$textMuted">/</Text>
          <Text fontWeight="700">{product.title}</Text>
        </XStack>

        <XStack gap="$xl" flexDirection="column" $xl={{ flexDirection: "row" }}>
          {/* Left: Image */}
          <Card flexBasis="0%" $xl={{ flex: 1 }} overflow="hidden" bordered elevate>
            <Image source={{ uri: product.image }} width="100%" height={520} objectFit="cover" />
          </Card>

          {/* Right: Details */}
          <YStack flexBasis="0%" $xl={{ flex: 1 }} gap="$lg">
            <Text fontSize="$9" fontWeight="800">{product.title}</Text>
            <XStack gap="$sm" alignItems="center">
              <Text fontSize="$8" fontWeight="800">£{product.price}</Text>
              <Text color="$textSecondary">{String(product.condition).replace("_", " ")}</Text>
            </XStack>
            <Text color="$textSecondary">{product.description}</Text>

            <XStack gap="$sm">
              <Button size="$4">Add to cart</Button>
              <Button size="$4" variant="outlined">Add to wishlist</Button>
            </XStack>

            <YStack gap="$xs">
              <Text fontWeight="700">Specifications</Text>
              <Text color="$textSecondary">• Shaft: Regular flex\n• Grip: Standard\n• Hand: Right</Text>
            </YStack>
          </YStack>
        </XStack>
      </YStack>
    </YStack>
  )
}
