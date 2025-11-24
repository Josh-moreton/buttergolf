/**
 * Card Component
 *
 * A versatile container component with elevation, padding, and variant support.
 * Perfect for grouping related content with consistent styling.
 *
 * @example
 * ```tsx
 * <Card variant="elevated" padding="lg">
 *   <CardHeader>
 *     <Heading level={3}>Card Title</Heading>
 *   </CardHeader>
 *   <CardBody>
 *     <Text>Card content goes here</Text>
 *   </CardBody>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */

import { styled, GetProps, YStack, type YStackProps } from "tamagui";
import {
  Card as TamaguiCard,
  CardHeader as TamaguiCardHeader,
  CardFooter as TamaguiCardFooter,
  type CardProps as TamaguiCardProps,
  type CardHeaderProps as TamaguiCardHeaderProps,
  type CardFooterProps as TamaguiCardFooterProps,
} from "@tamagui/card";

const CardBase = styled(TamaguiCard, {
  name: "Card",

  // Base styles
  backgroundColor: "$surface",
  borderRadius: "$lg",
  overflow: "hidden",
  position: "relative",

  variants: {
    variant: {
      elevated: {
        shadowColor: "rgba(0, 0, 0, 0.15)",
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,

        hoverStyle: {
          shadowColor: "rgba(0, 0, 0, 0.2)",
          shadowRadius: 32,
          shadowOffset: { width: 0, height: 16 },
          elevation: 16,
        },
      },

      outlined: {
        borderWidth: 1,
        borderColor: "$border",
        shadowRadius: 0,
        elevation: 0,

        hoverStyle: {
          borderColor: "$borderHover",
        },
      },

      filled: {
        backgroundColor: "$card",
        shadowRadius: 0,
        elevation: 0,

        hoverStyle: {
          backgroundColor: "$cardHover",
        },
      },

      ghost: {
        backgroundColor: "transparent",
        shadowRadius: 0,
        elevation: 0,
      },
    },

    interactive: {
      true: {
        cursor: "pointer",

        pressStyle: {
          scale: 0.98,
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
    variant: "elevated",
  },

  // Default padding - use direct token props to override (padding="$lg", padding={0}, etc.)
  padding: "$md",
});

export const CardHeader = styled(TamaguiCardHeader, {
  name: "CardHeader",

  padding: "$md",
  borderBottomWidth: 1,
  borderBottomColor: "$border",

  variants: {
    noBorder: {
      true: {
        borderBottomWidth: 0,
      },
    },
  } as const,
});

export const CardBody = styled(YStack, {
  name: "CardBody",

  padding: "$md",
  flex: 1,
});

export const CardFooter = styled(TamaguiCardFooter, {
  name: "CardFooter",

  padding: "$md",
  borderTopWidth: 1,
  borderTopColor: "$border",

  variants: {
    noBorder: {
      true: {
        borderTopWidth: 0,
      },
    },

    align: {
      left: { justifyContent: "flex-start" },
      center: { justifyContent: "center" },
      right: { justifyContent: "flex-end" },
    },
  } as const,

  defaultVariants: {
    align: "left",
  },
});

// Attach subcomponents to Card for compound component pattern
export const Card = CardBase as typeof CardBase & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

// Export types that include BOTH our custom variants AND all base Tamagui Card props
export type CardProps = GetProps<typeof CardBase> & Omit<TamaguiCardProps, keyof GetProps<typeof CardBase>>;
export type CardHeaderProps = GetProps<typeof CardHeader> & Omit<TamaguiCardHeaderProps, keyof GetProps<typeof CardHeader>>;
export type CardBodyProps = GetProps<typeof CardBody> & Omit<YStackProps, keyof GetProps<typeof CardBody>>;
export type CardFooterProps = GetProps<typeof CardFooter> & Omit<TamaguiCardFooterProps, keyof GetProps<typeof CardFooter>>;
