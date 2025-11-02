"use client";

import { Button, Text, Row, Column, ScrollView, Card } from "@buttergolf/ui";

const CATEGORIES = [
  { key: "drivers", label: "Drivers" },
  { key: "woods", label: "Fairway Woods" },
  { key: "hybrids", label: "Hybrids" },
  { key: "irons", label: "Irons" },
  { key: "wedges", label: "Wedges" },
  { key: "putters", label: "Putters" },
  { key: "bags", label: "Bags" },
  { key: "balls", label: "Balls" },
  { key: "accessories", label: "Accessories" },
];

export function CategoriesSection() {
  return (
    <Column paddingVertical="$6">
      <Column
        maxWidth={1200}
        marginHorizontal="auto"
        paddingHorizontal="$4"
        gap="$lg"
      >
        <Text fontSize="$8" weight="bold">
          Shop by category
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Row gap="$sm" paddingVertical="$2">
            {CATEGORIES.map((c) => (
              <Button key={c.key} size="md" tone="outline">
                {c.label}
              </Button>
            ))}
          </Row>
        </ScrollView>
      </Column>
    </Column>
  );
}
