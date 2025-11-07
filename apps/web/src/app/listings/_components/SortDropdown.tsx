"use client";

import { Select } from "@buttergolf/ui";

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div style={{ minWidth: 200 }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          height: 40,
          paddingLeft: 12,
          paddingRight: 12,
          paddingTop: 8,
          paddingBottom: 8,
          borderRadius: 6,
          border: "1px solid #E5E7EB",
          backgroundColor: "#FFFFFF",
          color: "#1F2937",
          fontSize: 14,
          cursor: "pointer",
          outline: "none",
          width: "100%",
        }}
      >
        <option value="newest">Newest First</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="popular">Most Popular</option>
      </select>
    </div>
  );
}
