"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Text, XStack, YStack, Card, Image } from "@buttergolf/ui";

// Mock carousel data
const CAROUSEL_ITEMS = [
  {
    id: 1,
    discount: 20,
    title: "TaylorMade Stealth 2 Driver",
    description:
      "Barely used, perfect condition with headcover and adjustment tool included",
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
    description:
      "Like new Newport 2, SuperStroke grip, with original packaging",
    image: "https://images.unsplash.com/photo-1593111774240-d529f12a662c?w=800",
    price: 279,
    originalPrice: 329,
    slug: "scotty-cameron-newport-2-putter",
  },
];

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
];

function CarouselSlide({
  item,
  isActive,
}: Readonly<{ item: (typeof CAROUSEL_ITEMS)[0]; isActive: boolean }>) {
  return (
    <XStack
      animation="lazy"
      opacity={isActive ? 1 : 0}
      position={isActive ? "relative" : "absolute"}
      width="100%"
      height="100%"
      alignItems="center"
      paddingHorizontal="$8"
      paddingVertical="$6"
    >
      <YStack
        flex={1}
        gap="$3"
        maxWidth={420}
        paddingRight="$4"
      >
        <XStack alignItems="flex-start" gap="$3">
          <Text
            size="xl"
            fontSize={64}
            weight="bold"
            lineHeight={64}
            {...{ color: "primary" as any }}
          >
            {item.discount.toString()}%
          </Text>
          <YStack marginTop="$2">
            <Text
              size="md"
              weight="semibold"
              textTransform="uppercase"
              {...{ color: "default" as any }}
            >
              SALE
            </Text>
            <Text
              size="md"
              weight="semibold"
              textTransform="uppercase"
              {...{ color: "default" as any }}
            >
              OFF
            </Text>
          </YStack>
        </XStack>

        <Link
          href={`/products/${item.slug}`}
          style={{ textDecoration: "none" }}
        >
          <Text
            size="xl"
            fontSize={28}
            weight="bold"
            {...{ color: "default" as any }}
            {...{ hoverStyle: { color: "$info" } as any }}
          >
            {item.title}
          </Text>
        </Link>

        <Text {...{ color: "secondary" as any }} size="sm" fontSize={15}>
          {item.description}
        </Text>

        <Link
          href={`/products/${item.slug}`}
          style={{ textDecoration: "none" }}
        >
          <Button
            backgroundColor="$text"
            color="$textInverse"
            paddingHorizontal="$8"
            paddingVertical="$3"
            borderRadius="$3"
            marginTop="$2"
            hoverStyle={{ backgroundColor: "$info" }}
          >
            Shop Now
          </Button>
        </Link>
      </YStack>

      <YStack flex={1} alignItems="center" justifyContent="center">
        <Image
          source={{ uri: item.image }}
          width={380}
          height={380}
          objectFit="contain"
        />
      </YStack>
    </XStack>
  );
}
function FeaturedProductCard({
  item,
}: Readonly<{ item: (typeof FEATURED_CARDS)[0] }>) {
  return (
    <Link
      href={`/products/${item.slug}`}
      style={{
        textDecoration: "none",
        width: "100%",
        height: "100%",
        display: "block",
      }}
    >
      <Card
        flex={1}
        height="100%"
        backgroundColor="$card"
        borderWidth={0}
        borderRadius="$4"
        {...{ padding: "$5" as any }}
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
        <YStack height="100%" justifyContent="space-between">
          {/* Top: Text content */}
          <YStack {...{ gap: "xs" as any }}>
            <Text
              size="lg"
              weight="bold"
              {...{ color: "default" as any }}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text size="xs" fontSize={13} {...{ color: "secondary" as any }}>
              {item.subtitle}
            </Text>
          </YStack>

          {/* Bottom: Price and Image side by side */}
          <XStack alignItems="flex-end" justifyContent="space-between" marginTop="$4">
            <YStack {...{ gap: "xs" as any }}>
              <Text
                size="xs"
                fontSize={10}
                weight="semibold"
                textTransform="uppercase"
                {...{ color: "muted" as any }}
              >
                LIMITED TIME OFFER
              </Text>
              <XStack alignItems="center" {...{ gap: "xs" as any }}>
                <Text
                  size="xl"
                  fontSize={22}
                  weight="bold"
                  fontWeight="800"
                  {...{ color: "default" as any }}
                >
                  £{item.price}
                </Text>
                {Boolean(item.originalPrice) && (
                  <Text
                    size="md"
                    weight="medium"
                    {...{ color: "muted" as any }}
                    textDecorationLine="line-through"
                  >
                    £{item.originalPrice}
                  </Text>
                )}
              </XStack>
            </YStack>

            <Image
              source={{ uri: item.image }}
              width={110}
              height={110}
              objectFit="contain"
            />
          </XStack>
        </YStack>
      </Card>
    </Link>
  );
}

export function HeroSectionNew() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <YStack backgroundColor="$background" paddingVertical="$12">
      <YStack
        maxWidth={1280}
        marginHorizontal="auto"
        paddingHorizontal="$4"
        width="100%"
      >
        <YStack
          {...{ gap: "xl" as any }}
          $xl={{ flexDirection: "row", alignItems: "stretch" }}
          width="100%"
        >
          {/* Carousel - 2/3 width on desktop */}
          <YStack
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
              flexBasis: "0%",
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
              {...{ gap: "xs" as any }}
              zIndex={10}
            >
              {CAROUSEL_ITEMS.map((item, index) => (
                <XStack
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
            </XStack>
          </YStack>

          {/* Featured Cards - 1/3 width on desktop */}
          <YStack
            {...{ gap: "lg" as any }}
            width="100%"
            $xl={{
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: "0%",
              minWidth: 0,
              width: "auto",
              alignSelf: "stretch",
              minHeight: 500,
            }}
          >
            {FEATURED_CARDS.map((card) => (
              <YStack
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
              </YStack>
            ))}
          </YStack>
        </YStack>
      </YStack>
    </YStack>
  );
}
