"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button, Text, Row, Column, Card, Image } from "@buttergolf/ui"

// Mock carousel data
const CAROUSEL_ITEMS = [
  {
    id: 1,
    discount: 20,
    title: "TaylorMade Stealth 2 Driver",
    description: "Barely used, perfect condition with headcover and adjustment tool included",
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800",
    price: 349,
    originalPrice: 449,
    slug: "taylormade-stealth-2-driver-10-5",
  },
  {
    id: 2,
    discount: 30,
    title: "Titleist T200 Iron Set 5-PW",
    description: "Excellent condition, graphite shafts with regular flex",
    image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800",
    price: 699,
    originalPrice: 999,
    slug: "titleist-t200-irons-5-pw",
  },
  {
    id: 3,
    discount: 15,
    title: "Scotty Cameron Putter",
    description: "Like new Newport 2, SuperStroke grip, with original packaging",
    image: "https://images.unsplash.com/photo-1593111774240-d529f12a662c?w=800",
    price: 279,
    originalPrice: 329,
    slug: "scotty-cameron-newport-2-putter",
  },
]

const FEATURED_CARDS = [
  {
    id: 1,
    title: "Callaway Rogue ST",
    subtitle: "Complete Iron Set",
    price: 599,
    originalPrice: 799,
    image: "https://images.unsplash.com/photo-1530028828-25e8270d5d47?w=400",
    slug: "callaway-rogue-st",
  },
  {
    id: 2,
    title: "Ping Hoofer Bag",
    subtitle: "Stand Bag - Black",
    price: 149,
    originalPrice: 189,
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400",
    slug: "ping-hoofer-stand-bag-black",
  },
]

function CarouselSlide({ item, isActive }: Readonly<{ item: typeof CAROUSEL_ITEMS[0]; isActive: boolean }>) {
  return (
    <Row
      animation="lazy"
      opacity={isActive ? 1 : 0}
      position={isActive ? "relative" : "absolute"}
      width="100%"
      height="100%"
      flexDirection="row"
      align="center"
      paddingHorizontal="$8"
      paddingVertical="$6"
    >
      <Column flex={1} gap="$3" maxWidth={420} paddingRight="$4">
        <Row align="start" gap="$3">
          <Text fontSize={64} fontWeight="700" {...{ color: "$info" as any }} lineHeight={64}>
            {item.discount}%
          </Text>
          <Column marginTop="$2">
            <Text fontSize={16} fontWeight="600" textTransform="uppercase" {...{ color: "$text" as any }}>
              SALE
            </Text>
            <Text fontSize={16} fontWeight="600" textTransform="uppercase" {...{ color: "$text" as any }}>
              OFF
            </Text>
          </Column>
        </Row>

        <Link href={`/products/${item.slug}`} style={{ textDecoration: "none" }}>
          <Text fontSize={28} fontWeight="700" {...{ color: "$text" as any }} hoverStyle={{ color: "$info" as any }}>
            {item.title}
          </Text>
        </Link>

        <Text {...{ color: "$textSecondary" as any }} fontSize={15}>
          {item.description}
        </Text>

        <Link href={`/products/${item.slug}`} style={{ textDecoration: "none" }}>
          <Button
            backgroundColor="$text"
            {...{ color: "$textInverse" as any }}
            paddingHorizontal="$8"
            paddingVertical="$3"
            borderRadius="$3"
            marginTop="$2"
            hoverStyle={{ backgroundColor: "$info" }}
          >
            Shop Now
          </Button>
        </Link>
      </Column>

      <Column flex={1} align="center" justify="center">
        <Image
          source={{ uri: item.image }}
          width={380}
          height={380}
          objectFit="contain"
        />
      </Column>
    </Row>
  )
}function FeaturedProductCard({ item }: Readonly<{ item: typeof FEATURED_CARDS[0] }>) {
  return (
    <Link
      href={`/products/${item.slug}`}
      style={{ textDecoration: "none", width: "100%", height: "100%", display: "block" }}
    >
      <Card
        flex={1}
        height="100%"
        backgroundColor="$card"
        borderWidth={0}
        borderRadius="$4"
        {...{ padding: '$5' as any }}
        overflow="hidden"
        cursor="pointer"
        animation="quick"
        hoverStyle={{
          scale: 1.02,
          shadowColor: "$shadowColor",
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
        }}
        pressStyle={{ scale: 0.98 }}
      >
        <Column height="100%" justify="between">
          {/* Top: Text content */}
          <Column gap="$2">
            <Text fontSize={18} fontWeight="700" {...{ color: "$text" as any }} numberOfLines={2}>
              {item.title}
            </Text>
            <Text fontSize={13} {...{ color: "$textSecondary" as any }}>
              {item.subtitle}
            </Text>
          </Column>

          {/* Bottom: Price and Image side by side */}
          <Row align="end" justify="between" marginTop="$4">
            <Column gap="$1">
              <Text fontSize={10} fontWeight="600" textTransform="uppercase" {...{ color: "$textMuted" as any }}>
                LIMITED TIME OFFER
              </Text>
              <Row align="center" gap="$2">
                <Text fontSize={22} fontWeight="800" {...{ color: "$text" as any }}>
                  £{item.price}
                </Text>
                {Boolean(item.originalPrice) && (
                  <Text
                    fontSize={16}
                    fontWeight="500"
                    {...{ color: "$textMuted" as any }}
                    textDecorationLine="line-through"
                  >
                    £{item.originalPrice}
                  </Text>
                )}
              </Row>
            </Column>

            <Image
              source={{ uri: item.image }}
              width={110}
              height={110}
              objectFit="contain"
            />
          </Row>
        </Column>
      </Card>
    </Link>
  )
}

export function HeroSectionNew() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % CAROUSEL_ITEMS.length)
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <Column backgroundColor="$background" paddingVertical="$12">
      <Column maxWidth={1280} marginHorizontal="auto" paddingHorizontal="$4" width="100%">
        <Row
          gap="$5"
          flexDirection="column"
          $xl={{ flexDirection: "row", alignItems: "stretch" }}
          width="100%"
        >
          {/* Carousel - 2/3 width on desktop */}
          <Column
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$border"
            borderRadius="$6"
            overflow="hidden"
            position="relative"
            minHeight={500}
            width="100%"
            $xl={{ 
              flexGrow: 2,
              flexShrink: 1,
              flexBasis: '0%',
              minWidth: 0,
              width: "auto",
            }}
          >
            {CAROUSEL_ITEMS.map((item, index) => (
              <CarouselSlide
                key={item.id}
                item={item}
                isActive={index === activeSlide}
              />
            ))}

            {/* Pagination Dots */}
            <Row
              position="absolute"
              bottom="$4"
              left="50%"
              {...{ style: { transform: "translateX(-50%)" } }}
              gap="$2"
              zIndex={10}
            >
              {CAROUSEL_ITEMS.map((item, index) => (
                <Row
                  key={`dot-${item.id}`}
                  width={index === activeSlide ? 24 : 8}
                  height={8}
                  borderRadius={4}
                  backgroundColor={index === activeSlide ? "$info" : "$border"}
                  cursor="pointer"
                  onPress={() => setActiveSlide(index)}
                  animation="quick"
                />
              ))}
            </Row>
          </Column>

          {/* Featured Cards - 1/3 width on desktop */}
          <Column
            gap="$4"
            flexDirection="column"
            width="100%"
            $xl={{ 
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: '0%',
              flexDirection: "column",
              minWidth: 0,
              width: "auto",
              alignSelf: 'stretch',
              minHeight: 500,
            }}
          >
            {FEATURED_CARDS.map((card) => (
              <Column
                key={card.id}
                flex={1}
                minWidth="45%"
                $xl={{ 
                  flex: 1,
                  minWidth: 0,
                  width: "100%",
                }}
              >
                <FeaturedProductCard item={card} />
              </Column>
            ))}
          </Column>
        </Row>
      </Column>
    </Column>
  )
}
