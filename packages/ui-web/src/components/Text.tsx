/**
 * Typography Components
 *
 * Text, Heading, and Label components for consistent typography.
 * Replicates the Tamagui typography API for web use with Tailwind CSS.
 *
 * @example
 * ```tsx
 * <Text>Regular body text</Text>
 * <Text size="lg" weight="semibold">Large semibold text</Text>
 * <Heading level={1}>Page Title</Heading>
 * <Heading level={2}>Section Title</Heading>
 * <Label htmlFor="email">Email address</Label>
 * ```
 */

import * as React from "react";
import { cn } from "../utils/cn";

/* ============================================
 * TEXT COMPONENT
 * ============================================ */

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Font size */
  size?: "xs" | "sm" | "base" | "md" | "lg" | "xl" | "2xl";
  /** Font weight */
  weight?: "normal" | "medium" | "semibold" | "bold";
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Truncate text with ellipsis */
  truncate?: boolean;
  /** Text color variant */
  color?: "default" | "secondary" | "muted" | "inverse" | "primary" | "error" | "success";
  /** Render as a different element */
  as?: "p" | "span" | "div";
}

const textSizeStyles: Record<NonNullable<TextProps["size"]>, string> = {
  xs: "text-[11px] leading-[15px]",
  sm: "text-[13px] leading-[18px]",
  base: "text-[14px] leading-[20px]",
  md: "text-[15px] leading-[22px]",
  lg: "text-[16px] leading-[24px]",
  xl: "text-[18px] leading-[26px]",
  "2xl": "text-[20px] leading-[28px]",
};

const textWeightStyles: Record<NonNullable<TextProps["weight"]>, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const textColorStyles: Record<NonNullable<TextProps["color"]>, string> = {
  default: "text-text",
  secondary: "text-slate",
  muted: "text-cloud",
  inverse: "text-white",
  primary: "text-primary",
  error: "text-error",
  success: "text-success",
};

const textAlignStyles: Record<NonNullable<TextProps["align"]>, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      size = "base",
      weight = "normal",
      align,
      truncate = false,
      color = "default",
      as: Component = "p",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          // Base styles
          "font-sans",
          // Size
          textSizeStyles[size],
          // Weight
          textWeightStyles[weight],
          // Color
          textColorStyles[color],
          // Alignment
          align && textAlignStyles[align],
          // Truncate
          truncate && "overflow-hidden text-ellipsis whitespace-nowrap",
          // Custom className
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = "Text";

/* ============================================
 * HEADING COMPONENT
 * ============================================ */

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading level (1-6) */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Font weight override */
  weight?: "semibold" | "bold" | "extrabold";
  /** Text color variant */
  color?: "default" | "secondary" | "muted" | "inverse" | "primary";
}

const headingLevelStyles: Record<NonNullable<HeadingProps["level"]>, string> = {
  1: "text-[48px] leading-[54px]",
  2: "text-[40px] leading-[46px]",
  3: "text-[32px] leading-[38px]",
  4: "text-[28px] leading-[32px]",
  5: "text-[24px] leading-[28px]",
  6: "text-[20px] leading-[24px]",
};

const headingWeightStyles: Record<NonNullable<HeadingProps["weight"]>, string> = {
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
};

const headingColorStyles: Record<NonNullable<HeadingProps["color"]>, string> = {
  default: "text-text",
  secondary: "text-slate",
  muted: "text-cloud",
  inverse: "text-white",
  primary: "text-primary",
};

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      level = 2,
      align,
      weight = "bold",
      color = "default",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Tag = `h${level}` as const;

    return (
      <Tag
        ref={ref as React.Ref<HTMLHeadingElement>}
        className={cn(
          // Base styles
          "font-sans tracking-normal",
          // Level styles (size & line-height)
          headingLevelStyles[level],
          // Weight
          headingWeightStyles[weight],
          // Color
          headingColorStyles[color],
          // Alignment
          align && textAlignStyles[align],
          // Custom className
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Heading.displayName = "Heading";

/* ============================================
 * LABEL COMPONENT
 * ============================================ */

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Size variant */
  size?: "sm" | "base";
  /** Disabled state */
  disabled?: boolean;
  /** Required indicator */
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    { size = "sm", disabled = false, required = false, className, children, ...props },
    ref
  ) => {
    return (
      <label
        ref={ref}
        className={cn(
          // Base styles
          "font-sans font-medium cursor-pointer select-none block mb-1",
          // Size
          size === "sm" ? "text-[13px] leading-[18px]" : "text-[14px] leading-[20px]",
          // Color
          "text-text",
          // Disabled
          disabled && "opacity-50 cursor-not-allowed",
          // Custom className
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
    );
  }
);

Label.displayName = "Label";
