"use client";

import { Button, Input, Text, Row, Column } from "@buttergolf/ui";

export function NewsletterSection() {
  return (
    <Column paddingVertical="$10" backgroundColor="$background">
      <Column
        maxWidth={800}
        marginHorizontal="auto"
        paddingHorizontal="$4"
        width="100%"
        gap="$lg"
        alignItems="center"
      >
        <Column gap="$sm" alignItems="center">
          <Text size="$8" weight="bold" color="$text" textAlign="center">
            Don&apos;t miss deals
          </Text>
          <Text color="$textSecondary" size="$5" textAlign="center">
            Get the latest listings and price drops in your inbox
          </Text>
        </Column>
        <Row
          gap="$sm"
          maxWidth={500}
          width="100%"
          alignItems="stretch"
          $sm={{ flexDirection: "column" }}
          $md={{ flexDirection: "row" }}
        >
          <Input
            flex={1}
            size="$5"
            placeholder="you@example.com"
            borderRadius="$full"
            paddingHorizontal="$5"
          />
          <Button
            size="$5"
            backgroundColor="$primary"
            color="$textInverse"
            borderRadius="$full"
            flexShrink={0}
            width={180}
            $sm={{ width: "100%" }}
          >
            Subscribe
          </Button>
        </Row>
      </Column>
    </Column>
  );
}
