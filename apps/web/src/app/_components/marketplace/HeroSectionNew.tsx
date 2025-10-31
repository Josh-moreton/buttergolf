"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button, Text, YStack, XStack, Card, Image } from "@buttergolf/ui"

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
    link: "/listing/1",
  },
  {
    id: 2,
    discount: 30,
    title: "Titleist T200 Iron Set 5-PW",
    description: "Excellent condition, graphite shafts with regular flex",
    image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800",
    price: 699,
    originalPrice: 999,
    link: "/listing/2",
  },
  {
    id: 3,
    discount: 15,
    title: "Scotty Cameron Putter",
    description: "Like new Newport 2, SuperStroke grip, with original packaging",
    image: "https://images.unsplash.com/photo-1593111774240-d529f12a662c?w=800",
    price: 279,
    originalPrice: 329,
    link: "/listing/3",
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
    link: "/listing/4",
  },
  {
    id: 2,
    title: "Ping Hoofer Bag",
    subtitle: "Stand Bag - Black",
    price: 149,
    originalPrice: 189,
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400",
    link: "/listing/5",
  },
]

function CarouselSlide({ item, isActive }: Readonly<{ item: typeof CAROUSEL_ITEMS[0]; isActive: boolean }>) {
  return (
    <XStack
      animation="lazy"
      opacity={isActive ? 1 : 0}
      position={isActive ? "relative" : "absolute"}
      width="100%"
      height="100%"
      $sm={{ flexDirection: "column-reverse" }}
      $md={{ flexDirection: "row" }}
      alignItems="center"
      paddingHorizontal="$6"
      paddingVertical="$8"
    >
      <YStack flex={1} gap="$4" maxWidth={400}>
        <XStack alignItems="center" gap="$4">
          <Text fontSize={52} fontWeight="700" color="#3C50E0">
            {item.discount}%
          </Text>
          <YStack>
            <Text fontSize={18} fontWeight="600" textTransform="uppercase">
              SALE
            </Text>
            <Text fontSize={18} fontWeight="600" textTransform="uppercase">
              OFF
            </Text>
          </YStack>
        </XStack>

        <Link href={item.link} style={{ textDecoration: "none" }}>
          <Text fontSize={24} fontWeight="700" color="$color" hoverStyle={{ color: "#3C50E0" }}>
            {item.title}
          </Text>
        </Link>

        <Text color="$color" opacity={0.7}>
          {item.description}
        </Text>

        <Link href={item.link} style={{ textDecoration: "none" }}>
          <Button
            backgroundColor="#1C274C"
            color="white"
            paddingHorizontal="$8"
            paddingVertical="$3"
            hoverStyle={{ backgroundColor: "#495270" }}
          >
            Shop Now
          </Button>
        </Link>
      </YStack>

      <YStack flex={1} alignItems="center" justifyContent="center">
        <Image
          source={{ uri: item.image }}
          width={320}
          height={400}
          objectFit="contain"
        />
      </YStack>
    </XStack>
  )
}

function FeaturedProductCard({ item }: Readonly<{ item: typeof FEATURED_CARDS[0] }>) {
  return (
    <Link
      href={item.link}
      style={{ textDecoration: "none", width: "100%", height: "100%", display: "block" }}
    >
      <Card
        flex={1}
        height="100%"
        backgroundColor="$background"
        borderWidth={1}
        borderColor="$borderColor"
        borderRadius="$6"
        padding="$0"
        overflow="hidden"
        cursor="pointer"
        animation="quick"
        hoverStyle={{
          scale: 1.03,
          borderColor: "#3C50E0",
          shadowColor: "$shadowColor",
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
        }}
        pressStyle={{ scale: 0.98 }}
      >
        <XStack alignItems="center" gap="$4" padding="$6">
          <YStack flex={1} gap="$3">
            <Text fontSize={20} fontWeight="700" color="$color" numberOfLines={2}>
              {item.title}
            </Text>
            <Text fontSize={14} color="$color" opacity={0.7}>
              {item.subtitle}
            </Text>

            <YStack gap="$1" marginTop="$6">
              <Text fontSize={10} fontWeight="600" textTransform="uppercase" opacity={0.6}>
                LIMITED TIME OFFER
              </Text>
              <XStack alignItems="center" gap="$2">
                <Text fontSize={24} fontWeight="800" color="$color">
                  £{item.price}
                </Text>
                {Boolean(item.originalPrice) && (
                  <Text
                    fontSize={18}
                    fontWeight="500"
                    color="$color"
                    opacity={0.5}
                    textDecorationLine="line-through"
                  >
                    £{item.originalPrice}
                  </Text>
                )}
              </XStack>
            </YStack>
          </YStack>

          <YStack width={170}>
            <Image
              source={{ uri: item.image }}
              width={170}
              height={210}
              objectFit="contain"
            />
          </YStack>
        </XStack>
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
    <YStack backgroundColor="#F7F7F7" paddingVertical="$12">
      <YStack maxWidth={1280} marginHorizontal="auto" paddingHorizontal="$4" width="100%">
        <XStack
          gap="$5"
          flexDirection="column"
          $xl={{ flexDirection: "row", alignItems: "stretch" }}
          width="100%"
        >
          {/* Carousel - 2/3 width on desktop */}
          <YStack
            backgroundColor="$background"
            borderWidth={1}
            borderColor="$borderColor"
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
            <XStack
              position="absolute"
              bottom="$4"
              left="50%"
              {...{ style: { transform: "translateX(-50%)" } }}
              gap="$2"
              zIndex={10}
            >
              {CAROUSEL_ITEMS.map((item, index) => (
                <XStack
                  key={`dot-${item.id}`}
                  width={index === activeSlide ? 24 : 8}
                  height={8}
                  borderRadius={4}
                  backgroundColor={index === activeSlide ? "#3C50E0" : "#D1D5DB"}
                  cursor="pointer"
                  onPress={() => setActiveSlide(index)}
                  animation="quick"
                />
              ))}
            </XStack>
          </YStack>

          {/* Featured Cards - 1/3 width on desktop */}
          <YStack
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
            {FEATURED_CARDS.map((card, index) => (
              <YStack
                key={index}
                flex={1}
                minWidth="45%"
                $xl={{ 
                  flex: 1,
                  minWidth: 0,
                  width: "100%",
                }}
              >
                <FeaturedProductCard item={card} />
              </YStack>
            ))}
          </YStack>
        </XStack>
      </YStack>
    </YStack>
  )
}
