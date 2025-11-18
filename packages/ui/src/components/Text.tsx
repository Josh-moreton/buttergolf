/**
 * Typography Components
 *
 * A comprehensive set of text components with semantic variants for different use cases.
 * Includes Text, Heading, and Label components.
 *
 * IMPORTANT: Understanding 'size' in the design system:
 *
 * 1. For TEXT COMPONENTS (Text, Heading, Label):
 *    - Use numeric tokens: size="$1" through size="$16"
 *    - These control fontSize and lineHeight from the font scale
 *    - Example: <Text fontSize="$4">Body text</Text>
 *    - Note: Use fontSize prop directly, not size variant
 *
 * 2. For UI COMPONENTS (Button, Input, Badge, Spinner):
 *    - Use named variants: size="sm" | "md" | "lg"
 *    - These control height, padding, and geometric dimensions
 *    - Example: <Button size="md">Click me</Button>
 *
 * @example
 * ```tsx
 * // Text sizing - use fontSize with numeric tokens
 * <Text fontSize="$4">Regular body text (14px)</Text>
 * <Text fontSize="$5">Larger body text (15px)</Text>
 * <Text fontSize="$3" color="$textMuted">Small text</Text>
 *
 * // Headings - use level prop
 * <Heading level={1}>Page Title</Heading>
 * <Heading level={2}>Section Title</Heading>
 *
 * // Component sizing - use named size variants
 * <Button size="md">Medium button</Button>
 * <Input size="lg">Large input</Input>
 * ```
 */

import {
  styled,
  GetProps,
  Text as TamaguiText,
  Label as TamaguiLabel,
  type TextProps as TamaguiTextProps,
  type LabelProps as TamaguiLabelProps,
} from "tamagui";

/**
 * Base Text Component
 *
 * Uses Tamagui's built-in font size scale (numeric tokens $1-$16).
 * Control font size using the fontSize prop with numeric tokens.
 *
 * Default fontSize: $5 (15px body font)
 */
export const Text = styled(TamaguiText, {
  name: "Text",

  // Base styles
  color: "$text",
  fontFamily: "$body",
  fontSize: "$5", // Default to body text size (15px)

  variants: {
    weight: {
      normal: {
        fontWeight: "400",
      },
      medium: {
        fontWeight: "500",
      },
      semibold: {
        fontWeight: "600",
      },
      bold: {
        fontWeight: "700",
      },
    },

    align: {
      left: {
        textAlign: "left",
      },
      center: {
        textAlign: "center",
      },
      right: {
        textAlign: "right",
      },
    },

    truncate: {
      true: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
  } as const,

  defaultVariants: {
    weight: "normal",
  },
});

// Heading Components
const HeadingBase = styled(TamaguiText, {
  name: "Heading",
  color: "$text",
  fontFamily: "$heading",
  fontWeight: "700",
});

export const Heading = styled(HeadingBase, {
  variants: {
    level: {
      1: {
        tag: "h1",
        fontSize: "$10",
      },
      2: {
        tag: "h2",
        fontSize: "$9",
      },
      3: {
        tag: "h3",
        fontSize: "$8",
      },
      4: {
        tag: "h4",
        fontSize: "$7",
      },
      5: {
        tag: "h5",
        fontSize: "$6",
      },
      6: {
        tag: "h6",
        fontSize: "$5",
      },
    },

    align: {
      left: {
        textAlign: "left",
      },
      center: {
        textAlign: "center",
      },
      right: {
        textAlign: "right",
      },
    },
  } as const,

  defaultVariants: {
    level: 2,
  },
});

/**
 * Label Component for forms
 *
 * Uses fontSize prop with numeric tokens for sizing.
 * Default: $3 (13px)
 */
export const Label = styled(TamaguiLabel, {
  name: "Label",

  color: "$text",
  fontSize: "$3", // Default to small label size (13px)
  fontWeight: "500",
  marginBottom: "$2",
  cursor: "pointer",
  userSelect: "none",

  variants: {
    // Note: For required indicators, use a separate Text component for cross-platform compatibility
    // Example: <Row><Label>Name</Label><Text color="$error">*</Text></Row>

    disabled: {
      true: {
        opacity: 0.5,
        cursor: "not-allowed",
      },
    },
  } as const,
});

// Export types that include BOTH our custom variants AND all base Tamagui props
// This ensures TypeScript knows about inherited props like color, textAlign, etc.
export type TextProps = GetProps<typeof Text> & Omit<TamaguiTextProps, keyof GetProps<typeof Text>>;
export type HeadingProps = GetProps<typeof Heading> & Omit<TamaguiTextProps, keyof GetProps<typeof Heading>>;
export type LabelProps = GetProps<typeof Label> & Omit<TamaguiLabelProps, keyof GetProps<typeof Label>>;
