"use client";

import { Button, Card, Image, Text, Row, Column } from "@buttergolf/ui";

type Listing = {
  id: string;
  title: string;
  price: number;
  image: string;
  condition: "NEW" | "LIKE_NEW" | "EXCELLENT" | "GOOD" | "FAIR";
  slug: string;
};

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
    image:
      "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=1000",
    condition: "GOOD",
    slug: "titleist-t200-irons-5-pw",
  },
  {
    id: "3",
    title: "Scotty Cameron Newport 2 Putter",
    price: 279,
    image:
      "https://images.unsplash.com/photo-1599054735690-5c5e2b83b50a?w=1000",
    condition: "LIKE_NEW",
    slug: "scotty-cameron-newport-2-putter",
  },
  {
    id: "4",
    title: "Ping Hoofer Stand Bag (Black)",
    price: 149,
    image:
      "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=1000",
    condition: "EXCELLENT",
    slug: "ping-hoofer-stand-bag-black",
  },
  {
    id: "5",
    title: "Callaway Rogue ST Driver",
    price: 299,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1000",
    condition: "GOOD",
    slug: "callaway-rogue-st-driver",
  },
  {
    id: "6",
    title: "Mizuno JPX 921 Irons",
    price: 549,
    image:
      "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=1000",
    condition: "EXCELLENT",
    slug: "mizuno-jpx-921-irons",
  },
  {
    id: "7",
    title: "Odyssey White Hot Putter",
    price: 199,
    image:
      "https://images.unsplash.com/photo-1599054735690-5c5e2b83b50a?w=1000",
    condition: "LIKE_NEW",
    slug: "odyssey-white-hot-putter",
  },
  {
    id: "8",
    title: "TaylorMade Cart Bag",
    price: 179,
    image:
      "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=1000",
    condition: "GOOD",
    slug: "taylormade-cart-bag",
  },
  {
    id: "9",
    title: "Cobra King F9 Driver",
    price: 249,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1000",
    condition: "EXCELLENT",
    slug: "cobra-king-f9-driver",
  },
  {
    id: "10",
    title: "Ping G425 Irons 4-PW",
    price: 629,
    image:
      "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=1000",
    condition: "EXCELLENT",
    slug: "ping-g425-irons-4-pw",
  },
  {
    id: "11",
    title: "TaylorMade Spider Putter",
    price: 229,
    image:
      "https://images.unsplash.com/photo-1599054735690-5c5e2b83b50a?w=1000",
    condition: "GOOD",
    slug: "taylormade-spider-putter",
  },
  {
    id: "12",
    title: "Titleist Players 4 Stand Bag",
    price: 189,
    image:
      "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=1000",
    condition: "LIKE_NEW",
    slug: "titleist-players-4-stand-bag",
  },
  {
    id: "13",
    title: "Ping G425 Max Driver",
    price: 329,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1000",
    condition: "EXCELLENT",
    slug: "ping-g425-max-driver",
  },
  {
    id: "14",
    title: "Titleist AP3 Irons 5-PW",
    price: 579,
    image:
      "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=1000",
    condition: "GOOD",
    slug: "titleist-ap3-irons-5-pw",
  },
  {
    id: "15",
    title: "Cleveland RTX ZipCore Wedge",
    price: 119,
    image:
      "https://images.unsplash.com/photo-1599054735690-5c5e2b83b50a?w=1000",
    condition: "EXCELLENT",
    slug: "cleveland-rtx-zipcore-wedge",
  },
  {
    id: "16",
    title: "Sun Mountain Stand Bag",
    price: 139,
    image:
      "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=1000",
    condition: "GOOD",
    slug: "sun-mountain-stand-bag",
  },
  {
    id: "17",
    title: "Callaway Epic Speed Driver",
    price: 319,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1000",
    condition: "LIKE_NEW",
    slug: "callaway-epic-speed-driver",
  },
  {
    id: "18",
    title: "Srixon ZX5 Irons 5-PW",
    price: 649,
    image:
      "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=1000",
    condition: "EXCELLENT",
    slug: "srixon-zx5-irons-5-pw",
  },
  {
    id: "19",
    title: "Ping Sigma 2 Putter",
    price: 189,
    image:
      "https://images.unsplash.com/photo-1599054735690-5c5e2b83b50a?w=1000",
    condition: "GOOD",
    slug: "ping-sigma-2-putter",
  },
  {
    id: "20",
    title: "Callaway Org 14 Cart Bag",
    price: 199,
    image:
      "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=1000",
    condition: "EXCELLENT",
    slug: "callaway-org-14-cart-bag",
  },
];

import Link from "next/link";

function ListingCard({ item }: Readonly<{ item: Listing }>) {
  return (
    <Link href={`/products/${item.slug}`} style={{ textDecoration: "none" }}>
      <Card
        padding={0}
        borderRadius="$4"
        overflow="hidden"
        cursor="pointer"
        hoverStyle={{ scale: 1.01 }}
      >
        <Image
          source={{ uri: item.image }}
          width="100%"
          height={180}
          objectFit="cover"
        />
        <Column padding="$md" gap="$xs">
          <Text weight="bold" numberOfLines={2}>
            {item.title}
          </Text>
          <Row alignItems="center" justifyContent="space-between">
            <Text fontSize="$7" weight="bold" fontWeight="800">
              £{item.price}
            </Text>
            <Text fontSize="$2" opacity={0.7}>
              {item.condition.replace("_", " ")}
            </Text>
          </Row>
          <Button size="$4">View details</Button>
        </Column>
      </Card>
    </Link>
  );
}

export function RecentlyListedSection() {
  return (
    <Column paddingVertical="$8" backgroundColor="$background">
      <Column
        maxWidth={1280}
        marginHorizontal="auto"
        paddingHorizontal="$6"
        width="100%"
        gap="$6"
      >
        <Row alignItems="center" justifyContent="space-between">
          <Text fontSize="$9" weight="bold">
            Recently listed
          </Text>
          <Button size="$4">View all</Button>
        </Row>

        {/* Grid Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
            width: "100%",
          }}
        >
          {MOCK_LISTINGS.map((l) => (
            <ListingCard key={l.id} item={l} />
          ))}
        </div>
      </Column>
    </Column>
  );
}
