"use client"

import Link from "next/link"
import { Row, Column, Text, Image, Button, Card } from "@buttergolf/ui"

export default function ProductPageClient({
  product,
  slug,
}: Readonly<{ product: any; slug: string }>) {
  return (
    <Column paddingTop="$16" backgroundColor="$background">
      <Column maxWidth={1200} marginHorizontal="auto" paddingHorizontal="$4" paddingVertical="$6" {...{ gap: "lg" as any }}>
        {/* Breadcrumbs */}
        <Row {...{ gap: "xs" as any }} align="center">
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

        <Row {...{ gap: "xl" as any }} flexDirection="column" $xl={{ flexDirection: "row" }}>
          {/* Left: Image */}
          <Card flexBasis="0%" $xl={{ flex: 1 }} overflow="hidden" bordered elevate>
            <Image source={{ uri: product.image }} width="100%" height={520} objectFit="cover" />
          </Card>

          {/* Right: Details */}
          <Column flexBasis="0%" $xl={{ flex: 1 }} {...{ gap: "lg" as any }}>
            <Text fontSize="$9" fontWeight="800">{product.title}</Text>
            <Row {...{ gap: "sm" as any }} align="center">
              <Text fontSize="$8" fontWeight="800">£{product.price}</Text>
              <Text {...{ color: "$textSecondary" as any }}>{String(product.condition).replace("_", " ")}</Text>
            </Row>
            <Text {...{ color: "$textSecondary" as any }}>{product.description}</Text>

            <Row {...{ gap: "sm" as any }}>
              <Button size="$4">Add to cart</Button>
              <Button size="$4" variant="outlined">Add to wishlist</Button>
            </Row>

            <Column {...{ gap: "xs" as any }}>
              <Text fontWeight="700">Specifications</Text>
              <Text {...{ color: "$textSecondary" as any }}>• Shaft: Regular flex\n• Grip: Standard\n• Hand: Right</Text>
            </Column>
          </Column>
        </Row>
      </Column>
    </Column>
  )
}
