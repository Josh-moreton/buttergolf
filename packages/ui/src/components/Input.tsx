/**
 * Input Component
 *
 * A flexible input component with size variants and state styling.
 * Includes proper focus, hover, and error states.
 *
 * @example
 * ```tsx
 * <Input size="md" placeholder="Enter text" />
 * <Input size="lg" error helperText="This field is required" />
 * <Input size="sm" disabled value="Disabled input" />
 * ```
 */

import { styled, GetProps, Input as TamaguiInput, type InputProps as TamaguiInputProps } from 'tamagui'

export const Input = styled(TamaguiInput, {
  name: 'Input',

  // Base styles
  backgroundColor: '$surface',
  borderWidth: 1,
  borderColor: '$fieldBorder',
  borderRadius: 24,
  color: '$text',
  fontFamily: '$body',
  outlineWidth: 0,

  // Focus styles (using border for better cross-platform support)
  focusStyle: {
    borderColor: '$fieldBorderFocus',
    borderWidth: 2,
  },

  // Hover styles
  hoverStyle: {
    borderColor: '$fieldBorderHover',
  },

  // Disabled styles
  disabledStyle: {
    opacity: 0.5,
    cursor: 'not-allowed',
    backgroundColor: '$backgroundPress',
    borderColor: '$fieldBorderDisabled',
  },

  variants: {
    size: {
      sm: {
        height: '$inputSm',
        paddingHorizontal: '$2.5',
        fontSize: '$3',
      },
      md: {
        height: '$inputMd',
        paddingHorizontal: '$3',
        fontSize: '$4',
      },
      lg: {
        height: '$inputLg',
        paddingHorizontal: '$4',
        fontSize: '$5',
      },
    },

    error: {
      true: {
        borderColor: '$error',

        focusStyle: {
          borderColor: '$error',
          borderWidth: 2,
        },

        hoverStyle: {
          borderColor: '$errorDark',
        },
      },
    },

    success: {
      true: {
        borderColor: '$success',

        focusStyle: {
          borderColor: '$success',
          borderWidth: 2,
        },
      },
    },

    fullWidth: {
      true: {
        width: '100%',
      },
    },
  } as const,

  defaultVariants: {
    size: 'md',
  },
})

// Export type that includes BOTH our custom variants AND all base Tamagui Input props
export type InputProps = GetProps<typeof Input> & Omit<TamaguiInputProps, keyof GetProps<typeof Input>>
