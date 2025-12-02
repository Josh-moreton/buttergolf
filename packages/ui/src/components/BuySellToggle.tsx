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
    backgroundColor: "$primary" as const,
    borderWidth: 1,
    borderColor: "$primary" as const,
    color: "$textInverse" as const,
  };

  // Inactive button base props (Cream/White)
  const inactiveButtonProps = {
    backgroundColor: "$background" as const,
    borderWidth: 1,
    borderColor: "$border" as const,
    color: "$text" as const,
  };

  // Web-specific shadow styles for active button
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
        flex={isDesktop ? undefined : 1}
        {...(isDesktop && { style: { width: "25%", minWidth: 280 } })}
        {...(activeMode === "buying" ? activeButtonProps : inactiveButtonProps)}
        {...(activeMode === "buying" &&
          isWebPlatform && {
            style: {
              boxShadow:
                "0px 1px 5px 0px rgba(0, 0, 0, 0.25), inset 0px 2px 2px 0px #FF7E4C",
            },
          })}
        {...(activeMode !== "buying" &&
          isWebPlatform && {
            style: {
              boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.1)",
              background: "linear-gradient(180deg, #FFFFFF 0%, #FFFEF9 100%)",
            },
          })}
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
        flex={isDesktop ? undefined : 1}
        {...(isDesktop && { style: { width: "25%", minWidth: 280 } })}
        {...(activeMode === "selling"
          ? activeButtonProps
          : inactiveButtonProps)}
        {...(activeMode === "selling" &&
          isWebPlatform && {
            style: {
              boxShadow:
                "0px 1px 5px 0px rgba(0, 0, 0, 0.25), inset 0px 2px 2px 0px #FF7E4C",
            },
          })}
        {...(activeMode !== "selling" &&
          isWebPlatform && {
            style: {
              boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.1)",
              background: "linear-gradient(180deg, #FFFFFF 0%, #FFFEF9 100%)",
            },
          })}
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
