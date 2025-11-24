/**
 * Input Component
 *
 * A flexible input component with size variants and state styling.
 * Replicates the Tamagui Input API for web use with Tailwind CSS.
 *
 * @example
 * ```tsx
 * <Input size="md" placeholder="Enter text" />
 * <Input size="lg" error helperText="This field is required" />
 * <Input size="sm" disabled value="Disabled input" />
 * ```
 */

import * as React from "react";
import { cn } from "../utils/cn";
import { Text } from "./Text";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Size of the input */
  size?: "sm" | "md" | "lg";
  /** Error state */
  error?: boolean;
  /** Success state */
  success?: boolean;
  /** Whether the input should take full width */
  fullWidth?: boolean;
  /** Helper text shown below the input */
  helperText?: string;
  /** Icon to show at the start */
  startIcon?: React.ReactNode;
  /** Icon to show at the end */
  endIcon?: React.ReactNode;
}

const sizeStyles: Record<NonNullable<InputProps["size"]>, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-[14px]",
  lg: "h-12 px-5 text-[15px]",
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "md",
      error = false,
      success = false,
      fullWidth = true,
      helperText,
      startIcon,
      endIcon,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasIcon = startIcon || endIcon;

    const inputElement = (
      <input
        ref={ref}
        disabled={disabled}
        className={cn(
          // Base styles
          "font-sans bg-surface rounded-[24px] border transition-colors duration-200",
          "outline-none",
          "placeholder:text-slate/60",
          // Size styles
          sizeStyles[size],
          // Width
          fullWidth && "w-full",
          // Default border
          !error && !success && "border-iron hover:border-iron-hover focus:border-primary focus:border-2",
          // Error state
          error && "border-error hover:border-error-dark focus:border-error focus:border-2",
          // Success state
          success && "border-success hover:border-success-dark focus:border-success focus:border-2",
          // Disabled
          disabled && "opacity-50 cursor-not-allowed bg-cloud border-cloud",
          // Icon padding adjustments
          !!startIcon && "pl-10",
          !!endIcon && "pr-10",
          // Custom className
          className
        )}
        {...props}
      />
    );

    if (!hasIcon && !helperText) {
      return inputElement;
    }

    return (
      <div className={cn("relative", fullWidth && "w-full")}>
        {hasIcon ? (
          <div className="relative">
            {startIcon && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate">
                {startIcon}
              </span>
            )}
            {inputElement}
            {endIcon && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate">
                {endIcon}
              </span>
            )}
          </div>
        ) : (
          inputElement
        )}
        {helperText && (
          <Text
            size="sm"
            color={error ? "error" : success ? "success" : "secondary"}
            className="mt-1 px-1"
          >
            {helperText}
          </Text>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

/* ============================================
 * TEXTAREA COMPONENT
 * ============================================ */

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Error state */
  error?: boolean;
  /** Success state */
  success?: boolean;
  /** Whether the textarea should take full width */
  fullWidth?: boolean;
  /** Helper text shown below the textarea */
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      error = false,
      success = false,
      fullWidth = true,
      helperText,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative", fullWidth && "w-full")}>
        <textarea
          ref={ref}
          disabled={disabled}
          className={cn(
            // Base styles
            "font-sans bg-surface rounded-lg border transition-colors duration-200",
            "outline-none resize-y min-h-[100px] p-4",
            "text-[14px] leading-[20px]",
            "placeholder:text-slate/60",
            // Width
            fullWidth && "w-full",
            // Default border
            !error && !success && "border-iron hover:border-iron-hover focus:border-primary focus:border-2",
            // Error state
            error && "border-error hover:border-error-dark focus:border-error focus:border-2",
            // Success state
            success && "border-success hover:border-success-dark focus:border-success focus:border-2",
            // Disabled
            disabled && "opacity-50 cursor-not-allowed bg-cloud border-cloud resize-none",
            // Custom className
            className
          )}
          {...props}
        />
        {helperText && (
          <Text
            size="sm"
            color={error ? "error" : success ? "success" : "secondary"}
            className="mt-1 px-1"
          >
            {helperText}
          </Text>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
