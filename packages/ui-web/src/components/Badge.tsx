/**
 * Badge Component
 *
 * A small label component for status indicators, counts, and tags.
 * Replicates the Tamagui Badge API for web use with Tailwind CSS.
 *
 * @example
 * ```tsx
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error" size="sm">3</Badge>
 * <Badge variant="info">New</Badge>
 * ```
 */

import * as React from "react";
import { cn } from "../utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color variant */
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "warning"
    | "info"
    | "neutral"
    | "outline";
  /** Size of the badge */
  size?: "sm" | "md" | "lg";
  /** Render as a dot (no text) */
  dot?: boolean;
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-white",
  success: "bg-success-light text-success-dark",
  error: "bg-error-light text-error-dark",
  warning: "bg-warning-light text-warning-dark",
  info: "bg-info-light text-info-dark",
  neutral: "bg-cloud-press text-gray-700",
  outline: "bg-transparent border border-border text-text",
};

const sizeStyles: Record<NonNullable<BadgeProps["size"]>, string> = {
  sm: "px-2 py-0.5 text-[11px] min-h-[20px] min-w-[20px]",
  md: "px-2.5 py-1 text-[13px] min-h-[24px] min-w-[24px]",
  lg: "px-3 py-1.5 text-[14px] min-h-[28px] min-w-[28px]",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "neutral",
      size = "md",
      dot = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    if (dot) {
      return (
        <span
          ref={ref}
          className={cn(
            // Dot styles
            "inline-block w-2 h-2 rounded-full",
            // Variant (only bg color matters for dot)
            variant === "primary" && "bg-primary",
            variant === "secondary" && "bg-secondary",
            variant === "success" && "bg-success",
            variant === "error" && "bg-error",
            variant === "warning" && "bg-warning",
            variant === "info" && "bg-info",
            variant === "neutral" && "bg-slate",
            variant === "outline" && "bg-border",
            // Custom className
            className
          )}
          {...props}
        />
      );
    }

    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center font-medium rounded-full",
          // Variant styles
          variantStyles[variant],
          // Size styles
          sizeStyles[size],
          // Custom className
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
