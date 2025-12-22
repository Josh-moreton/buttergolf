"use client";

import { Switch as TamaguiSwitch, styled, GetProps, Label, XStack } from "tamagui";

/**
 * Switch Component
 *
 * A toggle switch built on @tamagui/switch for boolean state toggling.
 * Uses compound component pattern (Switch, Switch.Thumb).
 *
 * @example
 * // Basic switch
 * <Switch size="$4">
 *   <Switch.Thumb animation="bouncy" />
 * </Switch>
 *
 * @example
 * // Controlled switch with label
 * <SwitchWithLabel
 *   label="Enable notifications"
 *   checked={enabled}
 *   onCheckedChange={setEnabled}
 * />
 */

// Styled Switch frame with brand colours
const SwitchFrame = styled(TamaguiSwitch, {
  name: "Switch",
  backgroundColor: "$border",
  borderRadius: "$full",

  variants: {
    checked: {
      true: {
        backgroundColor: "$primary",
      },
    },
  } as const,
});

// Styled Switch thumb with brand colours
const SwitchThumb = styled(TamaguiSwitch.Thumb, {
  name: "SwitchThumb",
  backgroundColor: "$surface",
  borderRadius: "$full",
  borderWidth: 1,
  borderColor: "$border",

  hoverStyle: {
    borderColor: "$primary",
  },
});

// Main Switch component as compound component
export const Switch = SwitchFrame as typeof SwitchFrame & {
  Thumb: typeof SwitchThumb;
};

Switch.Thumb = SwitchThumb;

// Export types
export type SwitchProps = GetProps<typeof Switch>;
export type SwitchThumbProps = GetProps<typeof SwitchThumb>;

/**
 * SwitchWithLabel - Convenience wrapper for switch with label
 *
 * @example
 * <SwitchWithLabel
 *   label="Show favourites only"
 *   checked={showFavourites}
 *   onCheckedChange={setShowFavourites}
 * />
 */
export interface SwitchWithLabelProps {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "$2" | "$3" | "$4" | "$5";
  id?: string;
}

export function SwitchWithLabel({
  label,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled = false,
  size = "$4",
  id,
}: SwitchWithLabelProps) {
  const switchId = id ?? `switch-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <XStack alignItems="center" gap="$3">
      <Switch
        id={switchId}
        size={size}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      >
        <Switch.Thumb animation="bouncy" />
      </Switch>
      <Label
        htmlFor={switchId}
        size={size}
        cursor={disabled ? "not-allowed" : "pointer"}
        opacity={disabled ? 0.5 : 1}
      >
        {label}
      </Label>
    </XStack>
  );
}
