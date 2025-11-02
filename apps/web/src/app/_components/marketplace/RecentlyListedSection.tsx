"use client"

import { Button, Card, Image, Text, Row, Column } from "@buttergolf/ui"

type Listing = {
  id: string
  title: string
  price: number
  image: string
  condition: "NEW" | "LIKE_NEW" | "EXCELLENT" | "GOOD" | "FAIR"
  slug: string
}

const MOCK_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "TaylorMade Stealth 2 Driver 10.5°",
    price: 349,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1000",
    condition: "EXCELLENT",
    slug: "taylormade-stealth-2-driver-10-5",
  },
  {
    id: "2",
    title: "Titleist T200 Irons 5-PW",
    price: 699,
    image: "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=1000",
    condition: "GOOD",
    slug: "titleist-t200-irons-5-pw",
  },
  {
    id: "3",
    title: "Scotty Cameron Newport 2 Putter",
    price: 279,
    image: "https://images.unsplash.com/photo-1599054735690-5c5e2b83b50a?w=1000",
    condition: "LIKE_NEW",
    slug: "scotty-cameron-newport-2-putter",
  },
  {
    id: "4",
    title: "Ping Hoofer Stand Bag (Black)",
    price: 149,
    image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=1000",
    condition: "EXCELLENT",
    slug: "ping-hoofer-stand-bag-black",
  },
]

import Link from "next/link"

function ListingCard({ item }: Readonly<{ item: Listing }>) {
  return (
    <Link href={`/products/${item.slug}`} style={{ textDecoration: "none" }}>
      <Card {...{ padding: 0 as any }} borderRadius="$4" overflow="hidden" cursor="pointer" hoverStyle={{ scale: 1.01 }}>
        <Image
          source={{ uri: item.image }}
          width="100%"
          height={180}
          objectFit="cover"
        />
        <Column {...{ padding: 16 as any }} {...{ gap: "xs" as any }}>
          <Text fontWeight="700" numberOfLines={2}>{item.title}</Text>
          <Row align="center" {...{ justify: "between" as any }}>
            <Text fontSize="$7" fontWeight="800">£{item.price}</Text>
            <Text fontSize="$2" opacity={0.7}>{item.condition.replace("_", " ")}</Text>
          </Row>
          <Button size="md" tone="outline">View details</Button>
        </Column>
      </Card>
    </Link>
  )
}

export function RecentlyListedSection() {
  return (
    <Column paddingVertical="$6">
      <Column maxWidth={1200} marginHorizontal="auto" paddingHorizontal="$4" {...{ gap: "lg" as any }}>
        <Row align="center" {...{ justify: "between" as any }}>
          <Text fontSize="$8" fontWeight="700">Recently listed</Text>
          <Button tone="outline" size="md">View all</Button>
        </Row>
        <Row {...{ gap: "lg" as any }} wrap={true}>
          {MOCK_LISTINGS.map((l) => (
            <Column key={l.id} width="100%" $sm={{ width: "100%" }} $md={{ width: "48%" }} $lg={{ width: "23%" }}>
              <ListingCard item={l} />
            </Column>
          ))}
        </Row>
      </Column>
    </Column>
  )
}
