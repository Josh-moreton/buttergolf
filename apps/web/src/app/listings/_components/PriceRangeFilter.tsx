"use client";

import { Column, Row, Text, Slider, Input } from "@buttergolf/ui";
import { useState, useEffect } from "react";

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  selectedMin: number;
  selectedMax: number;
  onChange: (min: number, max: number) => void;
}

export function PriceRangeFilter({
  minPrice,
  maxPrice,
  selectedMin,
  selectedMax,
  onChange,
}: Readonly<PriceRangeFilterProps>) {
  const [localMin, setLocalMin] = useState(selectedMin);
  const [localMax, setLocalMax] = useState(selectedMax);

  // Sync with props when they change (e.g., filter reset)
  // This is a legitimate use of setState in effect - syncing local state with prop changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalMin(selectedMin);

    setLocalMax(selectedMax);
  }, [selectedMin, selectedMax]);

  const handleSliderChange = (values: number[]) => {
    setLocalMin(values[0]);
    setLocalMax(values[1]);
    onChange(values[0], values[1]);
  };

  const handleMinInputChange = (value: string) => {
    const num = Number.parseFloat(value) || minPrice;
    setLocalMin(num);
    if (num >= minPrice && num <= localMax) {
      onChange(num, localMax);
    }
  };

  const handleMaxInputChange = (value: string) => {
    const num = Number.parseFloat(value) || maxPrice;
    setLocalMax(num);
    if (num <= maxPrice && num >= localMin) {
      onChange(localMin, num);
    }
  };

  return (
    <Column gap="$md" width="100%">
      <Slider
        min={minPrice}
        max={maxPrice}
        step={10}
        value={[localMin, localMax]}
        onValueChange={handleSliderChange}
        width="100%"
      >
        <Slider.Track>
          <Slider.TrackActive />
        </Slider.Track>
        <Slider.Thumb index={0} />
        <Slider.Thumb index={1} />
      </Slider>
      <Row gap="$sm" alignItems="center" width="100%">
        <Column gap="$xs" flex={1} minWidth={0}>
          <Text size="$2" color="$textSecondary">
            Min
          </Text>
          <Input
            size="$3"
            type="number"
            value={localMin.toString()}
            onChange={(e) => handleMinInputChange(e.target.value)}
            placeholder="Min"
            width="100%"
          />
        </Column>
        <Text color="$textSecondary" paddingTop="$lg" flexShrink={0}>
          −
        </Text>
        <Column gap="$xs" flex={1} minWidth={0}>
          <Text size="$2" color="$textSecondary">
            Max
          </Text>
          <Input
            size="$3"
            type="number"
            value={localMax.toString()}
            onChange={(e) => handleMaxInputChange(e.target.value)}
            placeholder="Max"
            width="100%"
          />
        </Column>
      </Row>
      <Text size="$2" color="$textSecondary">
        ${localMin.toFixed(2)} - ${localMax.toFixed(2)}
      </Text>
    </Column>
  );
}
