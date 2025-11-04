"use client";

import { Button, Input, Text, Row, Column } from "@buttergolf/ui";

export function NewsletterSection() {
  return (
    <Column paddingVertical="$10" backgroundColor="$background">
      <Column
        maxWidth={1200}
        marginHorizontal="auto"
        paddingHorizontal="$4"
        width="100%"
        gap="$lg"
      >
        <Text fontSize="$8" weight="bold">
          Don&apos;t miss deals
        </Text>
        <Text opacity={0.8}>
          Get the latest listings and price drops in your inbox
        </Text>
        <Row
          gap="$sm"
          $sm={{ flexDirection: "column" }}
          $md={{ flexDirection: "row" }}
        >
          <Input flex={1} size="lg" placeholder="you@example.com" />
          <Button size="$5">Subscribe</Button>
        </Row>
      </Column>
    </Column>
  );
}
