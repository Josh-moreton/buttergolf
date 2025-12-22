"use client";

import { Column, Row, Text, Checkbox } from "@buttergolf/ui";

interface BrandFilterProps {
  availableBrands: string[];
  selectedBrands: string[];
  onChange: (brands: string[]) => void;
}

export function BrandFilter({
  availableBrands,
  selectedBrands,
  onChange,
}: Readonly<BrandFilterProps>) {
  const handleToggle = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onChange(selectedBrands.filter((b) => b !== brand));
    } else {
      onChange([...selectedBrands, brand]);
    }
  };

  if (availableBrands.length === 0) {
    return (
      <Text size="$3" color="$textSecondary">
        No brands available
      </Text>
    );
  }

  return (
    <Column gap="$xs">
      {availableBrands.map((brand) => (
        <Row
          key={brand}
          gap="$sm"
          alignItems="center"
          paddingVertical="$xs"
          cursor="pointer"
          onPress={() => handleToggle(brand)}
        >
          <Checkbox
            checked={selectedBrands.includes(brand)}
            onChange={() => handleToggle(brand)}
            size="sm"
          />
          <Text size="$3">{brand}</Text>
        </Row>
      ))}
    </Column>
  );
}
