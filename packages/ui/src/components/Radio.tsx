/**
 * Radio Component & RadioGroup
 *
 * Radio button components with label support and state styling.
 * Provides both individual Radio buttons and RadioGroup wrapper.
 *
 * Design matches Input component styling with circular radio indicators.
 * Uses semantic tokens for colors and spacing.
 *
 * @example
 * ```tsx
 * <RadioGroup
 *   value={condition}
 *   onValueChange={setCondition}
 * >
 *   <Radio value="new" label="New" />
 *   <Radio value="used" label="Used - Like New" />
 *   <Radio value="fair" label="Fair" />
 * </RadioGroup>
 *
 * <RadioGroup
 *   value={selectedOption}
 *   onValueChange={setSelectedOption}
 *   error
 *   helperText="Please select an option"
 * >
 *   <Radio value="option1" label="Option 1" />
 *   <Radio value="option2" label="Option 2" disabled />
 * </RadioGroup>
 * ```
 */

import { RadioGroup as TamaguiRadioGroup, styled, GetProps } from 'tamagui'
import type { RadioGroupProps as TamaguiRadioGroupProps, RadioGroupItemProps as TamaguiRadioGroupItemProps } from 'tamagui'

/**
 * RadioGroup wrapper component
 *
 * Controls a group of Radio buttons with shared state.
 * Supports error states and orientation (horizontal/vertical).
 */
export const RadioGroup = styled(TamaguiRadioGroup, {
  name: 'RadioGroup',

  // Base styles
  gap: '$md',
  flexDirection: 'column',

  variants: {
    orientation: {
      horizontal: {
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      vertical: {
        flexDirection: 'column',
      },
    },

    error: {
      true: {
        // Error styling applied to child Radio buttons via context
      },
    },
  } as const,

  defaultVariants: {
    orientation: 'vertical',
  },
})

/**
 * Individual Radio button component
 *
 * Uses Tamagui's RadioGroupItem with custom styling.
 * Styled to match Input component border colors and states.
 */
export const Radio = styled(TamaguiRadioGroup.Item, {
  name: 'Radio',

  // Base styles
  backgroundColor: '$surface',
  borderWidth: 2,
  borderColor: '$fieldBorder',
  borderRadius: '$full',
  width: 20,
  height: 20,
  padding: 0,

  // Remove default focus outline, use border instead
  outlineWidth: 0,

  // Checked indicator (inner circle)
  '$group-item-checked': {
    borderColor: '$primary',
  },

  // Hover styles
  hoverStyle: {
    borderColor: '$fieldBorderHover',
  },

  // Focus styles
  focusStyle: {
    borderColor: '$fieldBorderFocus',
    borderWidth: 2,
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
        width: 16,
        height: 16,
      },
      md: {
        width: 20,
        height: 20,
      },
      lg: {
        width: 24,
        height: 24,
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
  } as const,

  defaultVariants: {
    size: 'md',
  },
})

/**
 * Radio indicator (inner filled circle when checked)
 *
 * Styled to show primary color when radio is selected.
 */
export const RadioIndicator = styled(TamaguiRadioGroup.Indicator, {
  name: 'RadioIndicator',

  backgroundColor: '$primary',
  borderRadius: '$full',
  width: '60%',
  height: '60%',
})

// Export types
export type RadioGroupProps = GetProps<typeof RadioGroup> & Omit<TamaguiRadioGroupProps, keyof GetProps<typeof RadioGroup>>
export type RadioProps = GetProps<typeof Radio> & Omit<TamaguiRadioGroupItemProps, keyof GetProps<typeof Radio>>
