"use client";

import { styled } from "tamagui";

const StyledSelect = styled("select", {
  name: "StyledSelect",
  height: 40,
  paddingHorizontal: "$sm",
  paddingVertical: "$xs",
  borderRadius: "$sm",
  borderWidth: 1,
  borderColor: "$border",
  backgroundColor: "$surface",
  color: "$text",
  fontSize: "$3",
  cursor: "pointer",
  outline: "none",

  hoverStyle: {
    borderColor: "$borderHover",
  },

  focusStyle: {
    borderColor: "$borderFocus",
    borderWidth: 2,
  },
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
