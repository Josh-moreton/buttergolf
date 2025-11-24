/**
 * Spinner Component
 *
 * A loading indicator component with multiple sizes.
 * Replicates the Tamagui Spinner API for web use with Tailwind CSS.
 *
 * @example
 * ```tsx
 * <Spinner size="md" />
 * <Spinner size="lg" color="primary" />
 * ```
 */

import * as React from "react";
import { cn } from "../utils/cn";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size of the spinner */
  size?: "sm" | "md" | "lg" | "xl";
  /** Color variant */
  color?: "primary" | "secondary" | "white" | "current";
}

const sizeStyles: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
};

const colorStyles: Record<NonNullable<SpinnerProps["color"]>, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  white: "text-white",
  current: "text-current",
};

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = "md", color = "primary", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn(
          // Base styles
          "inline-block animate-spin",
          // Size
          sizeStyles[size],
          // Color
          colorStyles[color],
          // Custom className
          className
        )}
        {...props}
      >
        <svg
          className="w-full h-full"
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
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

Spinner.displayName = "Spinner";
