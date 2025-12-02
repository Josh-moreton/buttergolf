"use client";

import { Column, Row, Text, Checkbox, Input } from "@buttergolf/ui";
import { useState, useMemo } from "react";

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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBrands = useMemo(() => {
    if (!searchQuery) return availableBrands;
    return availableBrands.filter((brand) =>
      brand.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [availableBrands, searchQuery]);

  const handleToggle = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onChange(selectedBrands.filter((b) => b !== brand));
    } else {
      onChange([...selectedBrands, brand]);
    }
  };

  return (
    <Column gap="$sm">
      <Input
        size="$3"
        placeholder="Search brands..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Column gap="$xs" maxHeight={200} overflow="scroll">
        {filteredBrands.length === 0 ? (
          <Text size="$3" color="$textSecondary">
            No brands found
          </Text>
        ) : (
          filteredBrands.map((brand) => (
            <Row
              key={brand}
              gap="$sm"
              alignItems="center"
              paddingVertical="$xs"
              cursor="pointer"
              onClick={() => handleToggle(brand)}
            >
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onChange={() => handleToggle(brand)}
                size="sm"
              />
              <Text size="$3">{brand}</Text>
            </Row>
          ))
        )}
      </Column>
    </Column>
  );
}
