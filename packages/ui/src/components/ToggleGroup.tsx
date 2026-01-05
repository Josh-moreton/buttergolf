/**
 * ToggleGroup Component
 *
 * A group of toggle buttons for single-select options (like tabs/filters).
 * Uses Tamagui styling with proper brand theming.
 *
 * @example
 * ```tsx
 * <ToggleGroup
 *   value={statusFilter}
 *   onValueChange={setStatusFilter}
 *   options={[
 *     { value: "all", label: "All" },
 *     { value: "active", label: "Active" },
 *     { value: "sold", label: "Sold" },
 *   ]}
 * />
 * ```
 */

import { styled, GetProps, XStack } from "tamagui";
import { Button as TamaguiButton } from "tamagui";

export interface ToggleGroupOption<T extends string = string> {
  value: T;
  label: string;
}

export interface ToggleGroupProps<T extends string = string> {
  /** Current selected value */
  value: T;
  /** Callback when selection changes */
  onValueChange: (value: T) => void;
  /** Array of options to display */
  options: ToggleGroupOption<T>[];
  /** Size of the toggle buttons */
  size?: "$2" | "$3" | "$4" | "$5";
  /** Whether the toggle group is disabled */
  disabled?: boolean;
}

const ToggleGroupContainer = styled(XStack, {
  name: "ToggleGroupContainer",
  gap: "$xs",
  alignItems: "center",
  flexWrap: "wrap",
});

const ToggleButton = styled(TamaguiButton, {
  name: "ToggleButton",
  fontFamily: "$body",
  fontWeight: "600",
  cursor: "pointer",
  borderRadius: "$full",
  borderWidth: 1,
  paddingHorizontal: "$md",
  paddingVertical: "$sm",

  variants: {
    active: {
      true: {
        backgroundColor: "$primary",
        borderColor: "$primaryBorder",
        color: "$textInverse",

        hoverStyle: {
          backgroundColor: "$primaryHover",
        },

        pressStyle: {
          backgroundColor: "$primaryPress",
          scale: 0.98,
        },
      },
      false: {
        backgroundColor: "transparent",
        borderColor: "$border",
        color: "$text",

        hoverStyle: {
          backgroundColor: "$backgroundHover",
          borderColor: "$borderHover",
        },

        pressStyle: {
          backgroundColor: "$backgroundPress",
          scale: 0.98,
        },
      },
    },
  } as const,

  defaultVariants: {
    active: false,
  },
});

/**
 * ToggleGroup Component
 *
 * A group of mutually exclusive toggle buttons.
 * Perfect for status filters, view switches, and other single-select options.
 */
export function ToggleGroup<T extends string = string>({
  value,
  onValueChange,
  options,
  size = "$3",
  disabled = false,
}: ToggleGroupProps<T>) {
  return (
    <ToggleGroupContainer>
      {options.map((option) => (
        <ToggleButton
          key={option.value}
          size={size}
          active={value === option.value}
          onPress={() => onValueChange(option.value)}
          disabled={disabled}
        >
          {option.label}
        </ToggleButton>
      ))}
    </ToggleGroupContainer>
  );
}

export type ToggleButtonProps = GetProps<typeof ToggleButton>;
