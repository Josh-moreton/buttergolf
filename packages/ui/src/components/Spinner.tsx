/**
 * Spinner Component
 *
 * A loading indicator with multiple sizes and colors.
 * Re-exports Tamagui's Spinner with semantic variants.
 *
 * IMPORTANT: Spinner 'size' is a COMPONENT VARIANT (not a font size token)
 * - size="sm" | "md" | "lg" controls the spinner's WIDTH and HEIGHT
 * - Uses space tokens ($4, $5, $6) for geometric dimensions
 *
 * @example
 * ```tsx
 * <Spinner size="md" />
 * <Spinner size="lg" color="$primary" />
 * <Spinner size="sm" color="$success" />
 * ```
 */

import {
  styled,
  GetProps,
  Spinner as TamaguiSpinner,
  type SpinnerProps as TamaguiSpinnerProps,
} from "tamagui";

export const Spinner = styled(TamaguiSpinner, {
  name: "Spinner",

  color: "$primary",

  variants: {
    size: {
      sm: {
        width: "$4",
        height: "$4",
      },
      md: {
        width: "$5",
        height: "$5",
      },
      lg: {
        width: "$6",
        height: "$6",
      },
    },
  } as const,

  defaultVariants: {
    size: "md",
  },
});

// Export type that includes BOTH our custom variants AND all base Tamagui Spinner props
export type SpinnerProps = GetProps<typeof Spinner> &
  Omit<TamaguiSpinnerProps, keyof GetProps<typeof Spinner>>;
