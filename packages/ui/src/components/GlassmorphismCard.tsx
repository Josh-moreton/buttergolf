import { styled, View } from "tamagui";

/**
 * iOS-style liquid glass effect card
 *
 * Features:
 * - Backdrop blur (frosted glass effect)
 * - Semi-transparent background
 * - Curved corners
 * - Inner shadow for dimensional appearance
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

  // Default styling
  borderRadius: "$2xl",
  borderWidth: 1,
  borderColor: "rgba(255, 255, 255, 0.3)",

  // Default intensity - medium
  backgroundColor: "rgba(255, 255, 255, 0.4)",

  variants: {
    intensity: {
      light: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
      },
      medium: {
        backgroundColor: "rgba(255, 255, 255, 0.4)",
      },
      strong: {
        backgroundColor: "rgba(255, 255, 255, 0.6)",
      },
      dark: {
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        borderColor: "rgba(255, 255, 255, 0.1)",
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
 * Hook to get consistent glassmorphism styles for web-specific styling
 * Use this when you need to apply the effect via style prop
 */
export const getGlassmorphismStyles = (blur: "light" | "medium" | "strong" = "medium") => {
  const blurAmount = {
    light: "4px",
    medium: "8px",
    strong: "12px",
  }[blur];

  return {
    backdropFilter: `blur(${blurAmount})`,
    WebkitBackdropFilter: `blur(${blurAmount})`,
    boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.05), inset 0 -1px 2px rgba(0, 0, 0, 0.03), 0 2px 8px rgba(0, 0, 0, 0.08)",
  };
};

export type GlassmorphismCardProps = React.ComponentProps<typeof GlassmorphismCard>;
