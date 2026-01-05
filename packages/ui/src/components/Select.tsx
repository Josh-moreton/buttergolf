/**
 * Select Component
 *
 * A simple select/dropdown component with size variants and state styling.
 * Matches Input component styling for visual consistency in forms.
 *
 * Uses an options-based API for easy usage:
 *
 * @example
 * ```tsx
 * <Select
 *   size="md"
 *   value={category}
 *   onValueChange={setCategory}
 *   options={[
 *     { value: "clubs", label: "Golf Clubs" },
 *     { value: "balls", label: "Golf Balls" },
 *   ]}
 *   placeholder="Select category..."
 * />
 * ```
 */

import React from "react";
import { useTheme } from "tamagui";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  /** Current selected value */
  value: string;
  /** Callback when selection changes */
  onValueChange: (value: string) => void;
  /** Array of options to display */
  options: SelectOption[];
  /** Placeholder text when no value selected */
  placeholder?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Error state */
  error?: boolean;
  /** Success state */
  success?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

const SIZE_STYLES = {
  sm: {
    height: 32,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  md: {
    height: 40,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  lg: {
    height: 48,
    paddingHorizontal: 20,
    fontSize: 16,
  },
};

/**
 * Select Component
 *
 * A styled select dropdown with consistent theming.
 */
export function Select({
  value,
  onValueChange,
  options,
  placeholder,
  size = "md",
  error = false,
  success = false,
  fullWidth = false,
  disabled = false,
}: SelectProps) {
  const theme = useTheme();
  const sizeStyles = SIZE_STYLES[size];

  // Get border color based on state
  const getBorderColor = () => {
    if (error) return theme.error?.val || "#dc2626";
    if (success) return theme.success?.val || "#02aaa4";
    return theme.fieldBorder?.val || "#323232";
  };

  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      disabled={disabled}
      style={{
        height: sizeStyles.height,
        paddingLeft: sizeStyles.paddingHorizontal,
        paddingRight: sizeStyles.paddingHorizontal + 24,
        fontSize: sizeStyles.fontSize,
        fontFamily: "inherit",
        fontWeight: 500,
        borderRadius: 24,
        border: `1px solid ${getBorderColor()}`,
        backgroundColor: theme.surface?.val || "#FFFFFF",
        color: theme.text?.val || "#323232",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? "100%" : "auto",
        minWidth: 150,
        outline: "none",
        appearance: "none",
        WebkitAppearance: "none",
        MozAppearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23323232' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: `right ${sizeStyles.paddingHorizontal}px center`,
      }}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
