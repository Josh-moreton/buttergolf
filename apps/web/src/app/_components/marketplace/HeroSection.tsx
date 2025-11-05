"use client";

import { Button, Text, Row, Column, Card, Image } from "@buttergolf/ui";

export function HeroSection() {
  return (
    <Column backgroundColor="$background" paddingVertical="$10">
      <Column maxWidth={1200} marginHorizontal="auto" paddingHorizontal="$4">
        <Row
          $sm={{ flexDirection: "column" }}
          $lg={{ flexDirection: "row" }}
          gap="$xl"
          alignItems="center"
        >
          <Column flex={1} gap="$lg">
            <Text fontSize="$10" fontWeight="800" lineHeight={44}>
              Buy & sell golf clubs peer‑to‑peer
            </Text>
            <Text fontSize="$6">
              Find great deals on drivers, irons, putters and more — or list
              your gear in minutes.
            </Text>
            <Row gap="$sm" flexWrap="wrap">
              <Button size="$5">Browse listings</Button>
              <Button size="$5">Sell your clubs</Button>
            </Row>
          </Column>

          <Column flex={1} gap="$lg">
            <Card backgroundColor="$background" padding={0}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=1200",
                }}
                width="100%"
                height={240}
                objectFit="cover"
                borderRadius="$4"
                alt="Golf clubs showcase"
              />
            </Card>
            <Row
              gap="$lg"
              $sm={{ flexDirection: "column" }}
              $md={{ flexDirection: "row" }}
            >
              <Card flex={1} padding="$md">
                <Text fontWeight="700">Featured</Text>
                <Text>Hot deals this week</Text>
              </Card>
              <Card flex={1} padding="$md">
                <Text fontWeight="700">Fast listing</Text>
                <Text>Create a post in 60 seconds</Text>
              </Card>
            </Row>
          </Column>
        </Row>
      </Column>
    </Column>
  );
}
