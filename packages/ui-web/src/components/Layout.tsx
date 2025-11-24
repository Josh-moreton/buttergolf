/**
 * Layout Components
 *
 * Semantic layout components for building responsive layouts.
 * Replicates the Tamagui Row/Column/Container API for web use with Tailwind CSS.
 *
 * @example
 * ```tsx
 * <Column gap="lg">
 *   <Row gap="md" align="center" justify="between">
 *     <Text>Left content</Text>
 *     <Button>Right action</Button>
 *   </Row>
 * </Column>
 * ```
 */

import * as React from "react";
import { cn } from "../utils/cn";

/* ============================================
 * SHARED TYPES
 * ============================================ */

type Gap = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
type Align = "start" | "center" | "end" | "stretch" | "baseline";
type Justify = "start" | "center" | "end" | "between" | "around" | "evenly";

const gapStyles: Record<Gap, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
  "2xl": "gap-12",
  "3xl": "gap-16",
};

const alignStyles: Record<Align, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyStyles: Record<Justify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

/* ============================================
 * ROW COMPONENT (Horizontal Layout)
 * ============================================ */

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Gap between children */
  gap?: Gap;
  /** Vertical alignment */
  align?: Align;
  /** Horizontal distribution */
  justify?: Justify;
  /** Whether to wrap children */
  wrap?: boolean;
  /** Whether to take full width */
  fullWidth?: boolean;
}

export const Row = React.forwardRef<HTMLDivElement, RowProps>(
  (
    {
      gap = "none",
      align,
      justify,
      wrap = false,
      fullWidth = false,
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
          "flex flex-row",
          // Gap
          gapStyles[gap],
          // Alignment
          align && alignStyles[align],
          // Justification
          justify && justifyStyles[justify],
          // Wrap
          wrap && "flex-wrap",
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

Row.displayName = "Row";

/* ============================================
 * COLUMN COMPONENT (Vertical Layout)
 * ============================================ */

export interface ColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Gap between children */
  gap?: Gap;
  /** Horizontal alignment */
  align?: Align;
  /** Vertical distribution */
  justify?: Justify;
  /** Whether to take full width */
  fullWidth?: boolean;
}

export const Column = React.forwardRef<HTMLDivElement, ColumnProps>(
  (
    {
      gap = "none",
      align,
      justify,
      fullWidth = false,
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
          "flex flex-col",
          // Gap
          gapStyles[gap],
          // Alignment
          align && alignStyles[align],
          // Justification
          justify && justifyStyles[justify],
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

Column.displayName = "Column";

/* ============================================
 * CONTAINER COMPONENT (Max-width wrapper)
 * ============================================ */

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum width size */
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /** Center the container */
  centered?: boolean;
  /** Horizontal padding */
  padding?: "none" | "sm" | "md" | "lg";
}

const containerSizeStyles: Record<NonNullable<ContainerProps["size"]>, string> = {
  sm: "max-w-[640px]",
  md: "max-w-[768px]",
  lg: "max-w-[1024px]",
  xl: "max-w-[1280px]",
  "2xl": "max-w-[1536px]",
  full: "max-w-full",
};

const containerPaddingStyles: Record<NonNullable<ContainerProps["padding"]>, string> = {
  none: "px-0",
  sm: "px-4",
  md: "px-6",
  lg: "px-8",
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      size = "lg",
      centered = true,
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
          "w-full",
          // Size
          containerSizeStyles[size],
          // Centered
          centered && "mx-auto",
          // Padding
          containerPaddingStyles[padding],
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

Container.displayName = "Container";

/* ============================================
 * SPACER COMPONENT
 * ============================================ */

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Fixed size (overrides flex) */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const spacerSizeStyles: Record<NonNullable<SpacerProps["size"]>, string> = {
  xs: "h-1 w-1",
  sm: "h-2 w-2",
  md: "h-4 w-4",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
};

export const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  ({ size, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Flex grow if no fixed size
          !size && "flex-1",
          // Fixed size
          size && spacerSizeStyles[size],
          // Custom className
          className
        )}
        {...props}
      />
    );
  }
);

Spacer.displayName = "Spacer";

/* ============================================
 * DIVIDER COMPONENT
 * ============================================ */

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  /** Orientation */
  orientation?: "horizontal" | "vertical";
  /** Color variant */
  variant?: "default" | "subtle";
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ orientation = "horizontal", variant = "default", className, ...props }, ref) => {
    return (
      <hr
        ref={ref}
        className={cn(
          // Base styles
          "border-0",
          // Orientation
          orientation === "horizontal"
            ? "w-full h-px"
            : "h-full w-px self-stretch",
          // Variant
          variant === "default" ? "bg-border" : "bg-cloud",
          // Custom className
          className
        )}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";
