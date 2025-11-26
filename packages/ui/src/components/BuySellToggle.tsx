/**
 * BuySellToggle Component
 *
 * Cross-platform toggle for switching between Buying and Selling modes.
 * Matches Figma mockup with pill-shaped buttons and proper active/inactive states.
 *
 * Active (Spiced Clementine):
 * - Background: #F45314
 * - Border: 1px #F04300
 * - Drop shadow: 0 1 5 0 rgba(0,0,0,0.25)
 * - Inner shadow: inset 0 2 2 0 #FF7E4C (web only)
 *
 * Inactive (White/Cream):
 * - Background: linear-gradient(#FFFFFF, #FFFEF9) on web, #FFFEF9 on native
 * - Border: 1px #FAFAFA
 * - Drop shadow: 0 1 5 0 rgba(0,0,0,0.10)
 *
 * @example
 * ```tsx
 * // Mobile - flexible width
 * <BuySellToggle
 *   activeMode="buying"
 *   onModeChange={(mode) => setMode(mode)}
 * />
 *
 * // Web - fixed width buttons
 * <BuySellToggle
 *   activeMode="buying"
 *   onModeChange={(mode) => setMode(mode)}
 *   variant="desktop"
 * />
 * ```
 */

import { Button } from "tamagui";
import { Row } from "./Layout";

export type BuySellMode = "buying" | "selling";

export interface BuySellToggleProps {
  /** Currently active mode */
  activeMode: BuySellMode;
  /** Callback when mode changes */
  onModeChange: (mode: BuySellMode) => void;
  /** Layout variant - "mobile" uses flex, "desktop" uses fixed widths */
  variant?: "mobile" | "desktop";
}

export function BuySellToggle({
  activeMode,
  onModeChange,
  variant = "mobile",
}: Readonly<BuySellToggleProps>) {
  const isWebPlatform = typeof document !== "undefined";
  const isDesktop = variant === "desktop";

  // Active button base props (Spiced Clementine)
  const activeButtonProps = {
    backgroundColor: "#F45314",
    borderWidth: 1,
    borderColor: "#F04300",
    color: "#FFFAD2", // Vanilla Cream text
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
    hoverStyle: {
      backgroundColor: "#FF6B3D", // Lighter Spiced Clementine
      borderColor: "#F45314",
    },
  };

  // Inactive button base props (Cream/White)
  const inactiveButtonProps = {
    backgroundColor: "#FFFEF9",
    borderWidth: 1,
    borderColor: "#FAFAFA",
    color: "#323232", // Ironstone text
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    hoverStyle: {
      backgroundColor: "#FFFFFF",
      borderColor: "#EDEDED",
    },
  };

  // Web-specific styles for gradient and inner shadow
  const webActiveStyle = isWebPlatform
    ? {
        style: {
          boxShadow:
            "0px 1px 5px 0px rgba(0, 0, 0, 0.25), inset 0px 2px 2px 0px #FF7E4C",
        },
      }
    : {};

  const webInactiveStyle = isWebPlatform
    ? {
        style: {
          background: "linear-gradient(180deg, #FFFFFF 0%, #FFFEF9 100%)",
        },
      }
    : {};

  // Button sizing based on variant
  const buttonSizeProps = isDesktop
    ? { width: "25%", minWidth: 280 }
    : { flex: 1 };

  return (
    <Row
      gap={isDesktop ? "$lg" : "$4"}
      justifyContent="center"
      alignItems="center"
      width="100%"
    >
      {/* Buying Button */}
      <Button
        size="$5"
        fontWeight={isDesktop ? "500" : "600"}
        borderRadius="$full"
        {...buttonSizeProps}
        {...(activeMode === "buying" ? activeButtonProps : inactiveButtonProps)}
        {...(activeMode === "buying" ? webActiveStyle : webInactiveStyle)}
        pressStyle={{
          scale: 0.98,
          opacity: 0.9,
        }}
        onPress={() => onModeChange("buying")}
        aria-pressed={activeMode === "buying"}
        aria-label="Switch to buying mode"
      >
        Buying
      </Button>

      {/* Selling Button */}
      <Button
        size="$5"
        fontWeight={isDesktop ? "500" : "600"}
        borderRadius="$full"
        {...buttonSizeProps}
        {...(activeMode === "selling" ? activeButtonProps : inactiveButtonProps)}
        {...(activeMode === "selling" ? webActiveStyle : webInactiveStyle)}
        pressStyle={{
          scale: 0.98,
          opacity: 0.9,
        }}
        onPress={() => onModeChange("selling")}
        aria-pressed={activeMode === "selling"}
        aria-label="Switch to selling mode"
      >
        Selling
      </Button>
    </Row>
  );
}
