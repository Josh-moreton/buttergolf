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
          <Text fontSize="$8" weight="bold" color="$text" textAlign="center">
            Don&apos;t miss deals
          </Text>
          <Text color="$textSecondary" fontSize="$5" textAlign="center">
            Get the latest listings and price drops in your inbox
          </Text>
        </Column>
        <Row
          gap="$sm"
          maxWidth={500}
          width="100%"
          $sm={{ flexDirection: "column" }}
          $md={{ flexDirection: "row" }}
        >
          <Input
            flex={1}
            size="lg"
            placeholder="you@example.com"
            borderRadius="$full"
            paddingHorizontal="$5"
          />
          <Button
            size="lg"
            tone="primary"
            borderRadius="$full"
            paddingHorizontal="$6"
            {...{ style: { whiteSpace: 'nowrap' } }}
          >
            Subscribe
          </Button>
        </Row>
      </Column>
    </Column>
  );
}
