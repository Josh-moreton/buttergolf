/**
 * ButterGolf Brand Colors
 *
 * Centralized brand color definitions used by:
 * - Tamagui theme configuration
 * - Stripe embedded components (which can't use Tamagui tokens)
 * - Any third-party integrations requiring raw color values
 *
 * These are the single source of truth for brand colors.
 */
export const brandColors = {
  // Primary - Spiced Clementine (vibrant orange)
  spicedClementine: "#F45314",
  spicedClementineHover: "#D9450F",
  spicedClementinePress: "#BF3A0D",

  // Primary Light - Vanilla Cream (light background)
  vanillaCream: "#FFFAD2",
  vanillaCreamHover: "#FFF8C5",
  vanillaCreamPress: "#FFF6B8",

  // Secondary - Burnt Olive (dark accent)
  burntOlive: "#3E3B2C",
  burntOliveHover: "#353226",
  burntOlivePress: "#2C291F",

  // Tertiary - Lemon Haze (subtle accent)
  lemonHaze: "#EDECC3",
  lemonHazeHover: "#E5E4B5",
  lemonHazePress: "#DDDBA7",

  // Neutral Light - Cloud Mist (borders/dividers)
  cloudMist: "#EDEDED",
  cloudMistHover: "#E0E0E0",
  cloudMistPress: "#D3D3D3",

  // Neutral Medium - Slate Smoke (secondary text)
  slateSmoke: "#545454",
  slateSmokeHover: "#4A4A4A",
  slateSmokePress: "#404040",

  // Neutral Dark - Ironstone (primary text)
  ironstone: "#323232",
  ironstoneHover: "#2A2A2A",
  ironstonePress: "#1F1F1F",

  // Pure White
  pureWhite: "#FFFFFF",

  // Status Colors
  success: "#02aaa4",
  successLight: "#E6F7F6",
  successDark: "#018A85",

  error: "#dc2626",
  errorLight: "#FEE2E2",
  errorDark: "#B91C1C",

  warning: "#F45314", // Uses primary color
  warningLight: "#FFF3E0",
  warningDark: "#D9450F",

  info: "#3c50e0",
  infoLight: "#EEF0FC",
  infoDark: "#2A3BB5",
} as const;

export type BrandColor = keyof typeof brandColors;
