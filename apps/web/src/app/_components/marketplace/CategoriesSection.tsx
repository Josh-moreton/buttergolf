"use client";

import { Button, Text, Row, Column, ScrollView } from "@buttergolf/ui";
import { CATEGORIES } from "@buttergolf/db";

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
            {CATEGORIES.map((category) => (
              <Button key={category.slug} size="$4">
                {category.name}
              </Button>
            ))}
          </Row>
        </ScrollView>
      </Column>
    </Column>
  );
}
