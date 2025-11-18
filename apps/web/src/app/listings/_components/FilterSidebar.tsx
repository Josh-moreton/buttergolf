"use client";

import { Column, Button, Text } from "@buttergolf/ui";
import { FilterSection } from "./FilterSection";
import { CategoryFilter } from "./CategoryFilter";
import { ConditionFilter } from "./ConditionFilter";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { BrandFilter } from "./BrandFilter";

export interface FilterState {
  category: string | null;
  conditions: string[];
  minPrice: number;
  maxPrice: number;
  brands: string[];
}

interface FilterSidebarProps {
  filters: FilterState;
  availableBrands: string[];
  priceRange: { min: number; max: number };
  onChange: (filters: Partial<FilterState>) => void;
  onClearAll: () => void;
}

export function FilterSidebar({
  filters,
  availableBrands,
  priceRange,
  onChange,
  onClearAll,
}: FilterSidebarProps) {
  return (
    <Column
      width={280}
      style={{ position: "sticky" }}
      top={140}
      minHeight={200}
      backgroundColor="$surface"
      borderWidth={1}
      borderColor="$border"
      borderRadius="$md"
      padding="$lg"
      gap="$lg"
      display="none"
      className="desktop-filter-sidebar"
    >
      <Text weight="bold" size="$6">
        Filters
      </Text>

      <FilterSection title="Category">
        <CategoryFilter
          selectedCategory={filters.category}
          onChange={(category) => onChange({ category })}
        />
      </FilterSection>

      <FilterSection title="Condition">
        <ConditionFilter
          selectedConditions={filters.conditions}
          onChange={(conditions) => onChange({ conditions })}
        />
      </FilterSection>

      <FilterSection title="Price Range">
        <PriceRangeFilter
          minPrice={priceRange.min}
          maxPrice={priceRange.max}
          selectedMin={filters.minPrice}
          selectedMax={filters.maxPrice}
          onChange={(minPrice, maxPrice) => onChange({ minPrice, maxPrice })}
        />
      </FilterSection>

      <FilterSection title="Brand">
        <BrandFilter
          availableBrands={availableBrands}
          selectedBrands={filters.brands}
          onChange={(brands) => onChange({ brands })}
        />
      </FilterSection>

      <Button chromeless size="md" onPress={onClearAll}>
        Clear All
      </Button>
    </Column>
  );
}
