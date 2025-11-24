/**
 * Button Component
 *
 * A versatile button component with multiple variants and sizes.
 * Replicates the Tamagui Button API for web use with Tailwind CSS.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">Click me</Button>
 * <Button variant="outline" size="lg">Learn more</Button>
 * <Button variant="ghost" disabled>Disabled</Button>
 * ```
 */

import * as React from "react";
import { cn } from "../utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  /** Size of the button */
  size?: "sm" | "md" | "lg";
  /** Whether the button should take full width */
  fullWidth?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Icon to show before text */
  icon?: React.ReactNode;
  /** Icon to show after text */
  iconAfter?: React.ReactNode;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover active:bg-primary-press",
  secondary:
    "bg-secondary text-white hover:bg-secondary-hover active:bg-secondary-press",
  outline:
    "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white",
  ghost:
    "bg-transparent text-text hover:bg-cloud active:bg-cloud-press",
  destructive:
    "bg-error text-white hover:bg-error-dark active:bg-error-dark",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-base gap-2",
  lg: "h-12 px-6 text-md gap-2.5",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      disabled,
      icon,
      iconAfter,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center font-medium rounded-[24px]",
          "transition-colors duration-200 ease-in-out",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          // Variant styles
          variantStyles[variant],
          // Size styles
          sizeStyles[size],
          // Full width
          fullWidth && "w-full",
          // Disabled styles
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
          // Custom className
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="animate-spin mr-2">
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        {children}
        {iconAfter && !loading && (
          <span className="shrink-0">{iconAfter}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
