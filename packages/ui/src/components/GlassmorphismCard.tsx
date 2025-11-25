import { styled, View } from "tamagui";

/**
 * iOS-style liquid glass effect card
 *
 * Features:
 * - Backdrop blur (frosted glass effect)
 * - Semi-transparent white background (50% opacity by default)
 * - Curved corners with liquid glass edge effect
 * - Inner glow for dimensional "liquid" appearance
 * - Subtle border with transparency
 *
 * @example
 * ```tsx
 * <GlassmorphismCard intensity="medium" padding="$md">
 *   <Text>Content with glassmorphism effect</Text>
 * </GlassmorphismCard>
 * ```
 */
export const GlassmorphismCard = styled(View, {
  name: "GlassmorphismCard",

  // Default styling - 50% opacity white background
  borderRadius: "$2xl",
  borderWidth: 1.5,
  borderColor: "rgba(255, 255, 255, 0.6)",

  // Default intensity - medium (50% white)
  backgroundColor: "rgba(255, 255, 255, 0.5)",

  variants: {
    intensity: {
      light: {
        backgroundColor: "rgba(255, 255, 255, 0.35)",
        borderColor: "rgba(255, 255, 255, 0.4)",
      },
      medium: {
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderColor: "rgba(255, 255, 255, 0.6)",
      },
      strong: {
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderColor: "rgba(255, 255, 255, 0.8)",
      },
      dark: {
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        borderColor: "rgba(255, 255, 255, 0.15)",
      },
    },
    blur: {
      none: {},
      light: {},
      medium: {},
      strong: {},
    },
  } as const,

  defaultVariants: {
    intensity: "medium",
    blur: "medium",
  } as const,
});

/**
 * Get consistent glassmorphism styles for web-specific styling
 * Use this when you need to apply the effect via style prop
 * 
 * Creates a liquid glass effect with:
 * - Backdrop blur for frosted glass look
 * - Multiple layered shadows for depth and "liquid" edge appearance
 * - Inner highlight for dimensional glass effect
 */
export const getGlassmorphismStyles = (blur: "light" | "medium" | "strong" = "medium") => {
  const blurAmount = {
    light: "8px",
    medium: "16px",
    strong: "24px",
  }[blur];

  return {
    backdropFilter: `blur(${blurAmount}) saturate(180%)`,
    WebkitBackdropFilter: `blur(${blurAmount}) saturate(180%)`,
    // Liquid glass edge effect:
    // 1. Inner top highlight - creates glassy reflection
    // 2. Inner bottom shadow - adds depth
    // 3. Outer glow - soft edge diffusion for "liquid" feel
    // 4. Drop shadow - grounds the element
    boxShadow: `
      inset 0 1px 1px 0 rgba(255, 255, 255, 0.6),
      inset 0 -1px 1px 0 rgba(0, 0, 0, 0.05),
      0 0 0 1px rgba(255, 255, 255, 0.15),
      0 4px 16px -2px rgba(0, 0, 0, 0.1),
      0 8px 32px -4px rgba(0, 0, 0, 0.08)
    `.trim().replaceAll(/\s+/g, ' '),
  };
};

export type GlassmorphismCardProps = React.ComponentProps<typeof GlassmorphismCard>;
