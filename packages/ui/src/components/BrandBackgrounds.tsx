/**
 * Brand Background Components
 *
 * Helper components to increase usage of brand colors (Vanilla Cream, Lemon Haze)
 * and make the app more visually distinctive.
 *
 * These components wrap sections/content with brand-colored backgrounds,
 * making it easy to apply the brand palette consistently.
 *
 * @example
 * ```tsx
 * // Wrap a section in Vanilla Cream background
 * <VanillaCreamBackground padding="$2xl">
 *   <Heading level={2}>Trust & Safety</Heading>
 *   <Text>We verify all sellers...</Text>
 * </VanillaCreamBackground>
 *
 * // Use Lemon Haze for subtle highlight cards
 * <LemonHazeCard padding="$lg">
 *   <Text weight="semibold">Pro Tip</Text>
 *   <Text>Upload high-quality photos for better sales!</Text>
 * </LemonHazeCard>
 * ```
 */

import { styled, YStack, type YStackProps } from "tamagui";

/**
 * VanillaCreamBackground
 *
 * Wraps content in Vanilla Cream ($vanillaCream) background.
 * Use for:
 * - Section alternation (white/vanilla cream pattern)
 * - Hero sections as highlight background
 * - Empty states (warmer than white)
 * - Trust/testimonial sections
 */
export const VanillaCreamBackground = styled(YStack, {
  name: "VanillaCreamBackground",

  backgroundColor: "$vanillaCream",
  width: "100%",

  variants: {
    fullHeight: {
      true: {
        minHeight: "100vh",
      },
    },
  } as const,
});

/**
 * LemonHazeBackground
 *
 * Wraps content in Lemon Haze ($lemonHaze) background.
 * Use for:
 * - Sidebar backgrounds
 * - Selected/active states
 * - Callout sections
 * - Subtle emphasis
 */
export const LemonHazeBackground = styled(YStack, {
  name: "LemonHazeBackground",

  backgroundColor: "$lemonHaze",
  width: "100%",

  variants: {
    fullHeight: {
      true: {
        minHeight: "100vh",
      },
    },
  } as const,
});

/**
 * LemonHazeCard
 *
 * A Card-like component with Lemon Haze background.
 * Use for:
 * - Tip cards
 * - Info callouts
 * - Highlighted content
 * - Filter badges
 */
export const LemonHazeCard = styled(YStack, {
  name: "LemonHazeCard",

  backgroundColor: "$lemonHaze",
  borderRadius: "$lg",
  borderWidth: 1,
  borderColor: "$lemonHazeHover",
  padding: "$md",

  // Hover effect
  hoverStyle: {
    backgroundColor: "$lemonHazeHover",
  },

  // Press effect
  pressStyle: {
    backgroundColor: "$lemonHazePress",
    scale: 0.99,
  },

  variants: {
    size: {
      sm: {
        padding: "$sm",
        borderRadius: "$md",
      },
      md: {
        padding: "$md",
        borderRadius: "$lg",
      },
      lg: {
        padding: "$lg",
        borderRadius: "$xl",
      },
    },
  } as const,

  defaultVariants: {
    size: "md",
  },
});

/**
 * VanillaCreamCard
 *
 * A Card-like component with Vanilla Cream background.
 * Use for:
 * - Empty states
 * - Placeholder content
 * - Warm highlight cards
 * - Featured content
 */
export const VanillaCreamCard = styled(YStack, {
  name: "VanillaCreamCard",

  backgroundColor: "$vanillaCream",
  borderRadius: "$lg",
  borderWidth: 1,
  borderColor: "$vanillaCreamHover",
  padding: "$md",

  // Hover effect
  hoverStyle: {
    backgroundColor: "$vanillaCreamHover",
  },

  // Press effect
  pressStyle: {
    backgroundColor: "$vanillaCreamPress",
    scale: 0.99,
  },

  variants: {
    size: {
      sm: {
        padding: "$sm",
        borderRadius: "$md",
      },
      md: {
        padding: "$md",
        borderRadius: "$lg",
      },
      lg: {
        padding: "$lg",
        borderRadius: "$xl",
      },
    },
  } as const,

  defaultVariants: {
    size: "md",
  },
});

// Export types
export type VanillaCreamBackgroundProps = YStackProps;
export type LemonHazeBackgroundProps = YStackProps;
export type LemonHazeCardProps = YStackProps;
export type VanillaCreamCardProps = YStackProps;
