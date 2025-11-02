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

import { styled, GetProps, YStack } from "tamagui";
import {
  Card as TamaguiCard,
  CardHeader as TamaguiCardHeader,
  CardFooter as TamaguiCardFooter,
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
        shadowColor: "$shadowColor",
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,

        hoverStyle: {
          shadowColor: "$shadowColorHover",
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
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

export type CardProps = GetProps<typeof CardBase>;
export type CardHeaderProps = GetProps<typeof CardHeader>;
export type CardBodyProps = GetProps<typeof CardBody>;
export type CardFooterProps = GetProps<typeof CardFooter>;
