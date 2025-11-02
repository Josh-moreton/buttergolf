"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { YStack, XStack, Text, Image, Button, Card } from "@buttergolf/ui"

// Temporary mock fetcher – replace with Prisma once models exist
const MOCK = {
  "taylormade-stealth-2-driver-10-5": {
    title: "TaylorMade Stealth 2 Driver 10.5°",
    price: 349,
    condition: "EXCELLENT",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1400",
    description:
      "Barely used, perfect condition with headcover and adjustment tool included.",
  },
  "titleist-t200-irons-5-pw": {
    title: "Titleist T200 Irons 5-PW",
    price: 699,
    condition: "GOOD",
    image: "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=1400",
    description: "Graphite shafts with regular flex.",
  },
  "scotty-cameron-newport-2-putter": {
    title: "Scotty Cameron Newport 2 Putter",
    price: 279,
    condition: "LIKE_NEW",
    image: "https://images.unsplash.com/photo-1599054735690-5c5e2b83b50a?w=1400",
    description: "Like new Newport 2, SuperStroke grip, with original packaging.",
  },
  "ping-hoofer-stand-bag-black": {
    title: "Ping Hoofer Stand Bag (Black)",
    price: 149,
    condition: "EXCELLENT",
    image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=1400",
    description: "Lightweight stand bag with plenty of storage.",
  },
  "callaway-rogue-st": {
    title: "Callaway Rogue ST",
    price: 599,
    condition: "GOOD",
    image: "https://images.unsplash.com/photo-1530028828-25e8270d5d47?w=1400",
    description: "Complete iron set in great playing condition.",
  },
} as const

export default function ProductPage() {
  const params = useParams<{ slug: string | string[] }>()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
  const product = (MOCK as Record<string, any>)[slug as string]
  if (!product) {
    return (
      <YStack paddingTop={160} alignItems="center" justifyContent="center" minHeight="60vh">
        <Text fontSize="$8" fontWeight="700">Product not found</Text>
        <Link href="/" style={{ textDecoration: "none", marginTop: 12 }}>
          <Text {...{ color: "$info" as any }} hoverStyle={{ color: "$infoLight" as any }}>Go back home</Text>
        </Link>
      </YStack>
    )
  }

  return (
    <YStack paddingTop="$16" backgroundColor="$background">
      <YStack maxWidth={1200} marginHorizontal="auto" paddingHorizontal="$4" paddingVertical="$6" gap="$4">
        {/* Breadcrumbs */}
        <XStack gap="$2" alignItems="center">
          <Link href="/" style={{ textDecoration: "none" }}>
            <Text {...{ color: "$info" as any }} hoverStyle={{ color: "$infoLight" as any }}>Home</Text>
          </Link>
          <Text {...{ color: "$textMuted" as any }}>/</Text>
          <Link href="/products" style={{ textDecoration: "none" }}>
            <Text {...{ color: "$info" as any }} hoverStyle={{ color: "$infoLight" as any }}>Products</Text>
          </Link>
          <Text {...{ color: "$textMuted" as any }}>/</Text>
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
              <Text {...{ color: "$textSecondary" as any }}>{String(product.condition).replace("_", " ")}</Text>
            </XStack>
            <Text {...{ color: "$textSecondary" as any }}>{product.description}</Text>

            <XStack gap="$3">
              <Button size="$4">Add to cart</Button>
              <Button size="$4" variant="outlined">Add to wishlist</Button>
            </XStack>

            <YStack gap="$2">
              <Text fontWeight="700">Specifications</Text>
              <Text {...{ color: "$textSecondary" as any }}>• Shaft: Regular flex\n• Grip: Standard\n• Hand: Right</Text>
            </YStack>
          </YStack>
        </XStack>
      </YStack>
    </YStack>
  )
}
