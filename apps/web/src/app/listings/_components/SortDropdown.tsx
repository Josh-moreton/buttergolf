"use client";

import { styled } from "tamagui";

// Create a proper styled select component using our design system
const StyledSelect = styled("select", {
  name: "StyledSelect",

  // Use design tokens instead of hardcoded values
  minWidth: 200,
  height: "$10", // Use size token
  paddingHorizontal: "$3", // Use spacing tokens
  paddingVertical: "$2",
  borderRadius: "$md", // Use radius token
  borderWidth: 1,
  borderColor: "$border", // Use semantic color token
  backgroundColor: "$surface", // Use semantic color token
  color: "$text", // Use semantic color token
  fontSize: "$3", // Use typography token
  fontFamily: "$body", // Use font token
  cursor: "pointer",
  outline: "none",

  // Interaction states using semantic tokens
  hoverStyle: {
    borderColor: "$borderHover",
    backgroundColor: "$backgroundHover",
  },

  focusStyle: {
    borderColor: "$borderFocus",
    borderWidth: 2,
  },

  // Ensure proper sizing
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
});

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <StyledSelect
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="newest">Newest First</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="popular">Most Popular</option>
    </StyledSelect>
  );
}
