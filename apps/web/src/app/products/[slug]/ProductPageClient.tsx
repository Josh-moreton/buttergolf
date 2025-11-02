"use client"

import Link from "next/link"
import { Row, Column, Text, Image, Button, Card } from "@buttergolf/ui"

export default function ProductPageClient({
  product,
  slug,
}: Readonly<{ product: any; slug: string }>) {
  return (
    <Column paddingTop="$16" backgroundColor="$background">
      <Column maxWidth={1200} marginHorizontal="auto" paddingHorizontal="$4" paddingVertical="$6" gap="$4">
        {/* Breadcrumbs */}
        <Row gap="$2" align="center">
          <Link href="/" style={{ textDecoration: "none" }}>
            <Text {...{ color: "$info" as any }} hoverStyle={{ color: "$infoLight" as any }}>Home</Text>
          </Link>
          <Text {...{ color: "$textMuted" as any }}>/</Text>
          <Link href="/products" style={{ textDecoration: "none" }}>
            <Text {...{ color: "$info" as any }} hoverStyle={{ color: "$infoLight" as any }}>Products</Text>
          </Link>
          <Text {...{ color: "$textMuted" as any }}>/</Text>
          <Text fontWeight="700">{product.title}</Text>
        </Row>

        <Row gap="$6" flexDirection="column" $xl={{ flexDirection: "row" }}>
          {/* Left: Image */}
          <Card flexBasis="0%" $xl={{ flex: 1 }} overflow="hidden" bordered elevate>
            <Image source={{ uri: product.image }} width="100%" height={520} objectFit="cover" />
          </Card>

          {/* Right: Details */}
          <Column flexBasis="0%" $xl={{ flex: 1 }} gap="$4">
            <Text fontSize="$9" fontWeight="800">{product.title}</Text>
            <Row gap="$3" align="center">
              <Text fontSize="$8" fontWeight="800">£{product.price}</Text>
              <Text {...{ color: "$textSecondary" as any }}>{String(product.condition).replace("_", " ")}</Text>
            </Row>
            <Text {...{ color: "$textSecondary" as any }}>{product.description}</Text>

            <Row gap="$3">
              <Button size="$4">Add to cart</Button>
              <Button size="$4" variant="outlined">Add to wishlist</Button>
            </Row>

            <Column gap="$2">
              <Text fontWeight="700">Specifications</Text>
              <Text {...{ color: "$textSecondary" as any }}>• Shaft: Regular flex\n• Grip: Standard\n• Hand: Right</Text>
            </Column>
          </Column>
        </Row>
      </Column>
    </Column>
  )
}
