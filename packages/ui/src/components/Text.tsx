/**
 * Typography Components
 *
 * A comprehensive set of text components with semantic variants for different use cases.
 * Includes Text, Heading, and Label components with size and color variants.
 *
 * @example
 * ```tsx
 * <Text size="md">Regular text</Text>
 * <Text size="sm" color="muted">Small muted text</Text>
 * <Heading level={1}>Page Title</Heading>
 * <Heading level={2} color="primary">Section Title</Heading>
 * <Label htmlFor="input">Form Label</Label>
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

// Base Text Component
export const Text = styled(TamaguiText, {
  name: "Text",

  // Base styles
  color: "$text",
  fontFamily: "$body",

  variants: {
    size: {
      xs: {
        fontSize: "$2",
      },
      sm: {
        fontSize: "$3",
      },
      md: {
        fontSize: "$4",
      },
      lg: {
        fontSize: "$5",
      },
      xl: {
        fontSize: "$6",
      },
    },

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
    size: "md",
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

// Label Component for forms
export const Label = styled(TamaguiLabel, {
  name: "Label",

  color: "$text",
  fontSize: "$3",
  fontWeight: "500",
  marginBottom: "$2",
  cursor: "pointer",
  userSelect: "none",

  variants: {
    size: {
      sm: {
        fontSize: "$2",
      },
      md: {
        fontSize: "$3",
      },
      lg: {
        fontSize: "$4",
      },
    },

    // Note: For required indicators, use a separate Text component for cross-platform compatibility
    // Example: <Row><Label>Name</Label><Text color="$error">*</Text></Row>

    disabled: {
      true: {
        opacity: 0.5,
        cursor: "not-allowed",
      },
    },
  } as const,

  defaultVariants: {
    size: "md",
  },
});

// Export types that include BOTH our custom variants AND all base Tamagui props
// This ensures TypeScript knows about inherited props like color, textAlign, etc.
export type TextProps = GetProps<typeof Text> & Omit<TamaguiTextProps, keyof GetProps<typeof Text>>;
export type HeadingProps = GetProps<typeof Heading> & Omit<TamaguiTextProps, keyof GetProps<typeof Heading>>;
export type LabelProps = GetProps<typeof Label> & Omit<TamaguiLabelProps, keyof GetProps<typeof Label>>;
