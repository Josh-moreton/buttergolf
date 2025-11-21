"use client";

import { Column, Button, Text } from "@buttergolf/ui";
import { useMedia } from "tamagui";
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
  showFavoritesOnly: boolean;
}

interface FilterSidebarProps {
  readonly filters: FilterState;
  readonly availableBrands: string[];
  readonly priceRange: { readonly min: number; readonly max: number };
  readonly onChange: (filters: Partial<FilterState>) => void;
  readonly onClearAll: () => void;
}

export function FilterSidebar({
  filters,
  availableBrands,
  priceRange,
  onChange,
  onClearAll,
}: Readonly<FilterSidebarProps>) {
  const media = useMedia();

  // Hide sidebar on mobile - MobileFilterSheet handles filters
  if (!media.gtMd) return null;

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

      <FilterSection title="Favorites">
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <input
            type="checkbox"
            checked={filters.showFavoritesOnly}
            onChange={(e) => onChange({ showFavoritesOnly: e.target.checked })}
            style={{
              width: 20,
              height: 20,
              cursor: "pointer",
              accentColor: "#F45314",
            }}
          />
          <Text size="$4" color="$text">
            Show favorites only
          </Text>
        </label>
      </FilterSection>

      <Button chromeless size="$4" onPress={onClearAll}>
        Clear All
      </Button>
    </Column>
  );
}
