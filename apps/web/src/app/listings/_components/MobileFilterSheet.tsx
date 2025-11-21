"use client";

import { useEffect, useId } from "react";
import { Column, Row, Text, Button } from "@buttergolf/ui";
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
}: Readonly<MobileFilterSheetProps>) {
  const headingId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          zIndex: 1000,
        }}
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      <Column
        aria-modal="true"
        aria-labelledby={headingId}
        backgroundColor="$surface"
        borderTopLeftRadius="$2xl"
        borderTopRightRadius="$2xl"
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        zIndex={1001}
        maxHeight="85vh"
        style={{
          boxShadow: "0 -20px 60px rgba(0, 0, 0, 0.25)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Handle */}
        <Column alignItems="center" paddingTop="$2" paddingBottom="$1">
          <div
            style={{
              width: 48,
              height: 4,
              borderRadius: 9999,
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            }}
          />
        </Column>

        {/* Header */}
        <Column
          paddingHorizontal="$4"
          paddingVertical="$3"
          borderBottomWidth={1}
          borderBottomColor="$border"
        >
          <Row alignItems="center" justifyContent="space-between">
            <Text id={headingId} weight="bold" size="$6">
              Filters
            </Text>
            <Text
              color="$primary"
              size="$3"
              cursor="pointer"
              onPress={onClearAll}
            >
              Clear All
            </Text>
          </Row>
        </Column>

        {/* Body */}
        <Column flex={1} overflow="auto">
          <Column padding="$4" gap="$lg">
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

            <FilterSection title="Favorites" defaultExpanded>
              <Row
                alignItems="center"
                gap="$2"
                cursor="pointer"
                userSelect="none"
                onPress={() =>
                  onChange({ showFavoritesOnly: !filters.showFavoritesOnly })
                }
              >
                <input
                  type="checkbox"
                  checked={filters.showFavoritesOnly}
                  onChange={(e) =>
                    onChange({ showFavoritesOnly: e.target.checked })
                  }
                  style={{
                    width: 20,
                    height: 20,
                    cursor: "pointer",
                    accentColor: "var(--primary)",
                  }}
                />
                <Text size="$4" color="$text">
                  Show favorites only
                </Text>
              </Row>
            </FilterSection>
          </Column>
        </Column>

        {/* Footer */}
        <Column
          paddingHorizontal="$4"
          paddingVertical="$4"
          borderTopWidth={1}
          borderTopColor="$border"
        >
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
        </Column>
      </Column>
    </>
  );
}
