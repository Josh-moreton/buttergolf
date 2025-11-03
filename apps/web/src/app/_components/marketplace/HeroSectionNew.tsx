"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Text, Row, Column, Card, Image } from "@buttergolf/ui";
import { imagePaths } from "@buttergolf/assets";

// Mock carousel data
const CAROUSEL_ITEMS = [
  {
    id: 1,
    discount: 20,
    title: "TaylorMade Stealth 2 Driver",
    description:
      "Barely used, perfect condition with headcover and adjustment tool included",
    image: imagePaths.clubs.club1,
    price: 349,
    originalPrice: 449,
    slug: "taylormade-stealth-2-driver-10-5",
  },
  {
    id: 2,
    discount: 30,
    title: "Titleist T200 Iron Set 5-PW",
    description: "Excellent condition, graphite shafts with regular flex",
    image: imagePaths.clubs.club4,
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
    image: imagePaths.clubs.club6,
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
    image: imagePaths.clubs.club2,
    slug: "callaway-rogue-st",
  },
  {
    id: 2,
    title: "Ping Hoofer Bag",
    subtitle: "Stand Bag - Black",
    price: 149,
    originalPrice: 189,
    image: imagePaths.clubs.club3,
    slug: "ping-hoofer-stand-bag-black",
  },
];

function CarouselSlide({
  item,
  isActive,
}: Readonly<{ item: (typeof CAROUSEL_ITEMS)[0]; isActive: boolean }>) {
  return (
    <Row
      animation="lazy"
      opacity={isActive ? 1 : 0}
      position={isActive ? "relative" : "absolute"}
      width="100%"
      height="100%"
      alignItems="center"
      paddingHorizontal="$10"
      paddingVertical="$8"
      gap="$10"
    >
      <Column flex={1} gap="$4" maxWidth={480}>
        <Row alignItems="flex-start" gap="$3">
          <Text
            size="xl"
            fontSize={72}
            weight="bold"
            lineHeight={72}
            color="$primary"
          >
            {item.discount.toString()}%
          </Text>
          <Column marginTop="$3">
            <Text
              size="md"
              weight="semibold"
              textTransform="uppercase"
              color="$text"
              letterSpacing={1}
            >
              SALE
            </Text>
            <Text
              size="md"
              weight="semibold"
              textTransform="uppercase"
              color="$text"
              letterSpacing={1}
            >
              OFF
            </Text>
          </Column>
        </Row>

        <Link
          href={`/products/${item.slug}`}
          style={{ textDecoration: "none" }}
        >
          <Text
            size="xl"
            fontSize={32}
            weight="bold"
            color="$text"
            lineHeight={40}
            hoverStyle={{ color: "$primary" }}
          >
            {item.title}
          </Text>
        </Link>

        <Text color="$textSecondary" size="md" fontSize={16} lineHeight={24}>
          {item.description}
        </Text>

        <Link
          href={`/products/${item.slug}`}
          style={{ textDecoration: "none" }}
        >
          <Button
            backgroundColor="$primary"
            color="$textInverse"
            paddingHorizontal="$10"
            paddingVertical="$4"
            borderRadius="$lg"
            marginTop="$3"
            size="lg"
            hoverStyle={{
              backgroundColor: "$primaryHover",
              scale: 1.02,
            }}
            pressStyle={{
              backgroundColor: "$primaryPress",
              scale: 0.98,
            }}
          >
            Shop Now
          </Button>
        </Link>
      </Column>

      <Column flex={1} alignItems="center" justifyContent="center" padding="$6">
        <Image
          source={{ uri: item.image }}
          width={380}
          height={380}
          objectFit="contain"
          borderRadius="$2xl"
        />
      </Column>
    </Row>
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
        backgroundColor="$surface"
        borderWidth={1}
        borderColor="$border"
        borderRadius="$lg"
        padding="$6"
        overflow="hidden"
        cursor="pointer"
        animation="quick"
        shadowColor="$shadowColor"
        shadowRadius={8}
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.06}
        hoverStyle={{
          scale: 1.03,
          borderColor: "$primary",
          shadowRadius: 16,
          shadowOpacity: 0.12,
        }}
        pressStyle={{ scale: 0.98 }}
      >
        <Row height="100%" alignItems="center" gap="$4">
          {/* Left: Text content */}
          <Column flex={1} justifyContent="space-between" gap="$3" minWidth={0}>
            <Column gap="$2">
              <Text
                size="lg"
                weight="bold"
                color="$text"
                numberOfLines={2}
                lineHeight={28}
              >
                {item.title}
              </Text>
              <Text
                size="sm"
                fontSize={14}
                color="$textSecondary"
                lineHeight={20}
              >
                {item.subtitle}
              </Text>
            </Column>

            <Column gap="$2">
              <Text
                size="xs"
                fontSize={11}
                weight="semibold"
                textTransform="uppercase"
                color="$success"
                letterSpacing={0.5}
              >
                LIMITED TIME OFFER
              </Text>
              <Row alignItems="baseline" gap="$2">
                <Text
                  size="xl"
                  fontSize={26}
                  weight="bold"
                  fontWeight="800"
                  color="$primary"
                >
                  £{item.price}
                </Text>
                {Boolean(item.originalPrice) && (
                  <Text
                    size="sm"
                    weight="medium"
                    color="$textMuted"
                    textDecorationLine="line-through"
                  >
                    £{item.originalPrice}
                  </Text>
                )}
              </Row>
            </Column>
          </Column>

          {/* Right: Image with fixed dimensions */}
          <Column
            alignItems="center"
            justifyContent="center"
            width={140}
            height={140}
            flexShrink={0}
          >
            <Image
              source={{ uri: item.image }}
              width={140}
              height={140}
              objectFit="contain"
              borderRadius="$xl"
            />
          </Column>
        </Row>
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
    <Column backgroundColor="$background" paddingVertical="$12">
      <Column
        maxWidth={1440}
        marginHorizontal="auto"
        paddingHorizontal="$6"
        width="100%"
      >
        <Column
          gap="$xl"
          $xl={{ flexDirection: "row", alignItems: "stretch" }}
          width="100%"
        >
          {/* Carousel - 2/3 width on desktop */}
          <Column
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$border"
            borderRadius="$lg"
            overflow="hidden"
            position="relative"
            minHeight={520}
            width="100%"
            shadowColor="$shadowColor"
            shadowRadius={12}
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.08}
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
            <Row
              position="absolute"
              bottom="$6"
              left="50%"
              {...{ style: { transform: "translateX(-50%)" } }}
              gap="$2"
              zIndex={10}
            >
              {CAROUSEL_ITEMS.map((item, index) => (
                <Row
                  key={`dot-${item.id}`}
                  width={index === activeSlide ? 32 : 10}
                  height={10}
                  borderRadius="$full"
                  backgroundColor={
                    index === activeSlide ? "$primary" : "$border"
                  }
                  cursor="pointer"
                  onPress={() => setActiveSlide(index)}
                  animation="quick"
                  hoverStyle={{
                    backgroundColor:
                      index === activeSlide ? "$primaryHover" : "$borderHover",
                  }}
                />
              ))}
            </Row>
          </Column>

          {/* Featured Cards - 1/3 width on desktop */}
          <Column
            gap="$lg"
            width="100%"
            $xl={{
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: "0%",
              minWidth: 0,
              width: "auto",
              alignSelf: "stretch",
              minHeight: 520,
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
        </Column>
      </Column>
    </Column>
  );
}
