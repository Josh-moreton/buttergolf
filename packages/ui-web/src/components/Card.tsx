/**
 * Card Component
 *
 * A versatile container component with elevation, padding, and variant support.
 * Replicates the Tamagui Card API for web use with Tailwind CSS.
 *
 * @example
 * ```tsx
 * <Card variant="elevated">
 *   <Card.Header>
 *     <Heading level={3}>Card Title</Heading>
 *   </Card.Header>
 *   <Card.Body>
 *     <Text>Card content goes here</Text>
 *   </Card.Body>
 *   <Card.Footer>
 *     <Button>Action</Button>
 *   </Card.Footer>
 * </Card>
 * ```
 */

import * as React from "react";
import { cn } from "../utils/cn";

/* ============================================
 * CARD COMPONENT
 * ============================================ */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant */
  variant?: "elevated" | "outlined" | "filled" | "ghost";
  /** Whether the card is interactive (clickable) */
  interactive?: boolean;
  /** Whether the card should take full width */
  fullWidth?: boolean;
  /** Padding size */
  padding?: "none" | "sm" | "md" | "lg";
}

const variantStyles: Record<NonNullable<CardProps["variant"]>, string> = {
  elevated:
    "bg-surface shadow-[0_12px_24px_0_rgba(0,0,0,0.35)] hover:shadow-[0_20px_40px_0_rgba(0,0,0,0.45)]",
  outlined: "bg-surface border border-border hover:border-border-hover",
  filled: "bg-card hover:bg-card-hover",
  ghost: "bg-transparent",
};

const paddingStyles: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "p-0",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
};

const CardBase = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "elevated",
      interactive = false,
      fullWidth = false,
      padding = "md",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "rounded-[14px] overflow-hidden relative transition-all duration-200",
          // Variant styles
          variantStyles[variant],
          // Padding
          paddingStyles[padding],
          // Interactive
          interactive && "cursor-pointer active:scale-[0.98]",
          // Full width
          fullWidth && "w-full",
          // Custom className
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardBase.displayName = "Card";

/* ============================================
 * CARD.HEADER COMPONENT
 * ============================================ */

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Remove bottom border */
  noBorder?: boolean;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ noBorder = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "p-4",
          // Border
          !noBorder && "border-b border-border",
          // Custom className
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

/* ============================================
 * CARD.BODY COMPONENT
 * ============================================ */

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "p-4 flex-1",
          // Custom className
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardBody.displayName = "CardBody";

/* ============================================
 * CARD.FOOTER COMPONENT
 * ============================================ */

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Remove top border */
  noBorder?: boolean;
  /** Alignment of footer content */
  align?: "left" | "center" | "right";
}

const alignStyles: Record<NonNullable<CardFooterProps["align"]>, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ noBorder = false, align = "left", className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "p-4 flex items-center",
          // Border
          !noBorder && "border-t border-border",
          // Alignment
          alignStyles[align],
          // Custom className
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";

/* ============================================
 * COMPOUND COMPONENT EXPORT
 * ============================================ */

export const Card = Object.assign(CardBase, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});

export type { CardHeaderProps as CardHeaderPropsType };
export type { CardBodyProps as CardBodyPropsType };
export type { CardFooterProps as CardFooterPropsType };
