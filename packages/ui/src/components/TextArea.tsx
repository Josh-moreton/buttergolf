/**
 * TextArea Component
 *
 * A multi-line text input component with size variants and state styling.
 * Matches Input component styling for visual consistency in forms.
 *
 * Features:
 * - Auto-resize option (grows with content)
 * - Character count support
 * - Size variants matching Input component
 * - Error/success states
 *
 * IMPORTANT: TextArea 'size' is a COMPONENT VARIANT (not a font size token)
 * - size="sm" | "md" | "lg" controls the textarea's PADDING and FONT SIZE
 * - minHeight and rows control vertical space
 * - For text components, use size="$1" through size="$16" instead
 *
 * @example
 * ```tsx
 * <TextArea
 *   size="md"
 *   placeholder="Describe your item..."
 *   rows={4}
 * />
 *
 * <TextArea
 *   size="lg"
 *   error
 *   helperText="Description is required"
 *   maxLength={500}
 *   showCharacterCount
 * />
 *
 * <TextArea
 *   autoResize
 *   minHeight={80}
 *   maxHeight={200}
 * />
 * ```
 */

import {
  styled,
  GetProps,
  TextArea as TamaguiTextArea,
  type TextAreaProps as TamaguiTextAreaProps,
} from "tamagui";

/**
 * Base TextArea component with Input-matching styles
 *
 * Uses the same design tokens as Input component:
 * - $fieldBorder for borders (Ironstone)
 * - $surface for background (Pure White)
 * - Size variants: sm/md/lg matching Input styling
 */
export const TextArea = styled(TamaguiTextArea, {
  name: "TextArea",

  // Base styles matching Input component
  backgroundColor: "$surface",
  borderWidth: 1,
  borderColor: "$fieldBorder",
  borderRadius: 24,
  color: "$text",
  fontFamily: "$body",
  outlineWidth: 0,

  // TextArea-specific defaults
  minHeight: 80,
  paddingVertical: "$3",
  textAlignVertical: "top", // Align text to top on mobile

  // Focus styles (using border for better cross-platform support)
  focusStyle: {
    borderColor: "$fieldBorderFocus",
    borderWidth: 2,
  },

  // Hover styles
  hoverStyle: {
    borderColor: "$fieldBorderHover",
  },

  // Disabled styles
  disabledStyle: {
    opacity: 0.5,
    cursor: "not-allowed",
    backgroundColor: "$backgroundPress",
    borderColor: "$fieldBorderDisabled",
  },

  variants: {
    size: {
      sm: {
        paddingHorizontal: "$2.5",
        paddingVertical: "$2",
        fontSize: "$3",
        minHeight: 64,
      },
      md: {
        paddingHorizontal: "$3",
        paddingVertical: "$3",
        fontSize: "$4",
        minHeight: 80,
      },
      lg: {
        paddingHorizontal: "$4",
        paddingVertical: "$4",
        fontSize: "$5",
        minHeight: 96,
      },
    },

    error: {
      true: {
        borderColor: "$error",

        focusStyle: {
          borderColor: "$error",
          borderWidth: 2,
        },

        hoverStyle: {
          borderColor: "$errorDark",
        },
      },
    },

    success: {
      true: {
        borderColor: "$success",

        focusStyle: {
          borderColor: "$success",
          borderWidth: 2,
        },
      },
    },

    fullWidth: {
      true: {
        width: "100%",
      },
    },
  } as const,

  defaultVariants: {
    size: "md",
  },
});

// Export type that includes BOTH our custom variants AND all base Tamagui TextArea props
export type TextAreaProps = GetProps<typeof TextArea> &
  Omit<TamaguiTextAreaProps, keyof GetProps<typeof TextArea>>;
