"use client";

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortDropdown({ value, onChange }: Readonly<SortDropdownProps>) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        minWidth: 200,
        height: 40,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 10,
        border: "1px solid #D1D5DB",
        backgroundColor: "#FFFFFF",
        color: "#1E1E1E",
        fontSize: 14,
        fontFamily: "system-ui, sans-serif",
        cursor: "pointer",
        outline: "none",
        appearance: "none",
        WebkitAppearance: "none",
        MozAppearance: "none",
      }}
    >
      <option value="newest">Newest First</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="popular">Most Popular</option>
    </select>
  );
}
