"use client"

import { Button, Input, Text, Row, Column } from "@buttergolf/ui"

export function NewsletterSection() {
  return (
    <Column paddingVertical="$10" backgroundColor="$background">
      <Column maxWidth={1200} marginHorizontal="auto" paddingHorizontal="$4" gap="$4">
        <Text fontSize="$8" fontWeight="700">Don&apos;t miss deals</Text>
        <Text opacity={0.8}>Get the latest listings and price drops in your inbox</Text>
        <Row gap="$3" $sm={{ flexDirection: "column" }} $md={{ flexDirection: "row" }}>
          <Input flex={1} size="lg" placeholder="you@example.com" />
          <Button size="lg">Subscribe</Button>
        </Row>
      </Column>
    </Column>
  )
}
