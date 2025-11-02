/**
 * Spinner Component
 * 
 * A loading indicator with multiple sizes and colors.
 * Re-exports Tamagui's Spinner with semantic variants.
 * 
 * @example
 * ```tsx
 * <Spinner size="md" />
 * <Spinner size="lg" color="$primary" />
 * <Spinner size="sm" color="$success" />
 * ```
 */

import { styled, GetProps, Spinner as TamaguiSpinner } from 'tamagui'

export const Spinner = styled(TamaguiSpinner, {
  name: 'Spinner',
  
  color: '$primary',
  
  variants: {
    size: {
      sm: {
        size: 'small',
      },
      md: {
        size: 'medium',
      },
      lg: {
        size: 'large',
      },
    },
  } as const,

  defaultVariants: {
    size: 'md',
  },
})

export type SpinnerProps = GetProps<typeof Spinner>
