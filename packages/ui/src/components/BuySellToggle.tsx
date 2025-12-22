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

"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use mounted state instead of document check to avoid hydration mismatch
  const isWebPlatform = mounted;
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

  // Memoize desktop style to prevent object recreation on every render
  const desktopStyle = useMemo(
    () => (isDesktop ? { width: "25%", minWidth: 280 } : undefined),
    [isDesktop]
  );

  // Memoize web shadow styles to prevent object recreation
  const activeBoxShadow = useMemo(
    () => ({
      boxShadow:
        "0px 1px 5px 0px rgba(0, 0, 0, 0.25), inset 0px 2px 2px 0px #FF7E4C",
    }),
    []
  );

  const inactiveStyle = useMemo(
    () => ({
      boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.1)",
      background: "linear-gradient(180deg, #FFFFFF 0%, #FFFEF9 100%)",
    }),
    []
  );

  // Compute button-specific web styles based on active state
  const buyingWebStyle = isWebPlatform
    ? activeMode === "buying"
      ? activeBoxShadow
      : inactiveStyle
    : undefined;

  const sellingWebStyle = isWebPlatform
    ? activeMode === "selling"
      ? activeBoxShadow
      : inactiveStyle
    : undefined;

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
        style={{ ...desktopStyle, ...buyingWebStyle }}
        {...(activeMode === "buying" ? activeButtonProps : inactiveButtonProps)}
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
        style={{ ...desktopStyle, ...sellingWebStyle }}
        {...(activeMode === "selling"
          ? activeButtonProps
          : inactiveButtonProps)}
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
