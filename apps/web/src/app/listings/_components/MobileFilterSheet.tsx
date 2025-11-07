"use client";

import { Column, Row, Text, Button, Sheet } from "@buttergolf/ui";
import { FilterSection } from "./FilterSection";
import { CategoryFilter } from "./CategoryFilter";
import { ConditionFilter } from "./ConditionFilter";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { BrandFilter } from "./BrandFilter";
import type { FilterState } from "./FilterSidebar";

interface MobileFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  availableBrands: string[];
  priceRange: { min: number; max: number };
  onChange: (filters: Partial<FilterState>) => void;
  onClearAll: () => void;
  onApply: () => void;
}

export function MobileFilterSheet({
  open,
  onOpenChange,
  filters,
  availableBrands,
  priceRange,
  onChange,
  onClearAll,
  onApply,
}: MobileFilterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <Sheet.Handle />
      
      <Sheet.Header>
        <Row alignItems="center" justifyContent="space-between">
          <Text weight="bold" size="lg">
            Filters
          </Text>
          <Text
            color="$primary"
            size="sm"
            cursor="pointer"
            onPress={onClearAll}
          >
            Clear All
          </Text>
        </Row>
      </Sheet.Header>

      <Sheet.Body>
        <Column gap="$lg">
          <FilterSection title="Category" defaultExpanded>
            <CategoryFilter
              selectedCategory={filters.category}
              onChange={(category) => onChange({ category })}
            />
          </FilterSection>

          <FilterSection title="Condition" defaultExpanded>
            <ConditionFilter
              selectedConditions={filters.conditions}
              onChange={(conditions) => onChange({ conditions })}
            />
          </FilterSection>

          <FilterSection title="Price Range" defaultExpanded>
            <PriceRangeFilter
              minPrice={priceRange.min}
              maxPrice={priceRange.max}
              selectedMin={filters.minPrice}
              selectedMax={filters.maxPrice}
              onChange={(minPrice, maxPrice) => onChange({ minPrice, maxPrice })}
            />
          </FilterSection>

          <FilterSection title="Brand" defaultExpanded>
            <BrandFilter
              availableBrands={availableBrands}
              selectedBrands={filters.brands}
              onChange={(brands) => onChange({ brands })}
            />
          </FilterSection>
        </Column>
      </Sheet.Body>

      <Sheet.Footer>
        <Row gap="$md">
          <Button
            size="$4"
            flex={1}
            chromeless
            onPress={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            size="$4"
            flex={1}
            backgroundColor="$primary"
            color="$textInverse"
            onPress={() => {
              onApply();
              onOpenChange(false);
            }}
          >
            Apply Filters
          </Button>
        </Row>
      </Sheet.Footer>
    </Sheet>
  );
}
