"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Column, Row, Text } from "@buttergolf/ui";
import { CATEGORIES } from "@buttergolf/db";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onChange: (category: string | null) => void;
}

export function CategoryFilter({
  selectedCategory,
  onChange,
}: Readonly<CategoryFilterProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Build URL preserving other filters when navigating to category
  const buildCategoryUrl = (slug: string | null) => {
    if (slug === null) {
      // "All Categories" → go to /listings with current filters (except category)
      const params = new URLSearchParams(searchParams.toString());
      params.delete("category");
      const queryString = params.toString();
      return queryString ? `/listings?${queryString}` : "/listings";
    }

    // Navigate to clean category URL with filters preserved
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category"); // Clean URLs don't need category param
    params.delete("page"); // Reset to page 1
    const queryString = params.toString();
    return queryString ? `/category/${slug}?${queryString}` : `/category/${slug}`;
  };

  const handleCategoryClick = (slug: string | null) => {
    // Navigate to the appropriate URL
    router.push(buildCategoryUrl(slug));
    // Also call onChange for local state (used by parent components)
    onChange(slug);
  };

  return (
    <Column gap="$xs">
      <Row
        paddingVertical="$xs"
        paddingHorizontal="$sm"
        borderRadius="$sm"
        cursor="pointer"
        backgroundColor={
          selectedCategory === null ? "$primaryLight" : "$surface"
        }
        hoverStyle={{ backgroundColor: "$backgroundHover" }}
        onClick={() => handleCategoryClick(null)}
      >
        <Text
          size="$3"
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
          onClick={() => handleCategoryClick(category.slug)}
        >
          <Text
            size="$3"
            color={selectedCategory === category.slug ? "$primary" : "$text"}
            weight={selectedCategory === category.slug ? "semibold" : "normal"}
          >
            {category.name}
          </Text>
        </Row>
      ))}
    </Column>
  );
}
