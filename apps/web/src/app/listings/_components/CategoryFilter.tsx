"use client";

import { Column, Row, Text } from "@buttergolf/ui";
import { CATEGORIES } from "@buttergolf/db";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onChange: (category: string | null) => void;
}

export function CategoryFilter({
  selectedCategory,
  onChange,
}: CategoryFilterProps) {
  return (
    <Column gap="$xs">
      <Row
        paddingVertical="$xs"
        paddingHorizontal="$sm"
        borderRadius="$sm"
        cursor="pointer"
        backgroundColor={selectedCategory === null ? "$primaryLight" : "$surface"}
        hoverStyle={{ backgroundColor: "$backgroundHover" }}
        onClick={() => onChange(null)}
      >
        <Text
          fontSize="$3"
          color={selectedCategory === null ? "$primary" : "$text"}
          weight={selectedCategory === null ? "semibold" : "normal"}
        >
          All Categories
        </Text>
      </Row>
      {CATEGORIES.map((category) => (
        <Row
          key={category.slug}
          paddingVertical="$xs"
          paddingHorizontal="$sm"
          borderRadius="$sm"
          cursor="pointer"
          backgroundColor={
            selectedCategory === category.slug ? "$primaryLight" : "$surface"
          }
          hoverStyle={{ backgroundColor: "$backgroundHover" }}
          onClick={() => onChange(category.slug)}
        >
          <Text
            fontSize="$3"
            color={
              selectedCategory === category.slug ? "$primary" : "$text"
            }
            weight={selectedCategory === category.slug ? "semibold" : "normal"}
          >
            {category.name}
          </Text>
        </Row>
      ))}
    </Column>
  );
}
