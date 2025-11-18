/**
 * Button Component
 *
 * Semantic wrapper around Tamagui's Button with ButterGolf design system variants.
 * Provides size and tone variants that align with the shared token set.
 *
 * @example
 * ```tsx
 * <Button size="md" tone="primary">CTA</Button>
 * <Button size="sm" tone="outline">Secondary</Button>
 * <Button size="lg" tone="ghost" fullWidth>Ghost Action</Button>
 * <Button whiteSpace="nowrap">No wrap text</Button>
 * ```
 */

import { forwardRef, type ComponentRef } from "react";
import { Button as TamaguiButton, GetProps, styled, type ButtonProps as TamaguiButtonProps } from "tamagui";

const ButtonFrame = styled(TamaguiButton, {
    name: "Button",

    fontFamily: "$body",
    fontWeight: "600",
    borderRadius: 24,
    gap: "$2",

    disabledStyle: {
        opacity: 0.6,
    },

    variants: {
        tone: {
            primary: {
                backgroundColor: "$primary",
                color: "$textInverse",
                borderWidth: 0,
                hoverStyle: {
                    backgroundColor: "$primaryHover",
                },
                pressStyle: {
                    backgroundColor: "$primaryPress",
                },
                focusStyle: {
                    borderColor: "$primaryFocus",
                    borderWidth: 2,
                    backgroundColor: "$primary",
                },
            },
            secondary: {
                backgroundColor: "$secondary",
                color: "$textInverse",
                borderWidth: 0,
                hoverStyle: {
                    backgroundColor: "$secondaryHover",
                },
                pressStyle: {
                    backgroundColor: "$secondaryPress",
                },
                focusStyle: {
                    borderColor: "$secondaryFocus",
                    borderWidth: 2,
                    backgroundColor: "$secondary",
                },
            },
            outline: {
                backgroundColor: "transparent",
                color: "$primary",
                borderWidth: 2,
                borderColor: "$primary",
                hoverStyle: {
                    backgroundColor: "$primaryLight",
                },
                pressStyle: {
                    backgroundColor: "$primaryLight",
                },
                focusStyle: {
                    borderColor: "$primary",
                    borderWidth: 2,
                },
            },
            ghost: {
                backgroundColor: "transparent",
                color: "$primary",
                borderWidth: 0,
                hoverStyle: {
                    backgroundColor: "$primaryLight",
                },
                pressStyle: {
                    backgroundColor: "$primaryLight",
                },
                focusStyle: {
                    borderColor: "$primary",
                    borderWidth: 2,
                    backgroundColor: "transparent",
                },
            },
            success: {
                backgroundColor: "$success",
                color: "$textInverse",
                borderWidth: 0,
                hoverStyle: {
                    backgroundColor: "$successDark",
                },
                pressStyle: {
                    backgroundColor: "$successDark",
                },
                focusStyle: {
                    borderColor: "$success",
                    borderWidth: 2,
                    backgroundColor: "$success",
                },
            },
            error: {
                backgroundColor: "$error",
                color: "$textInverse",
                borderWidth: 0,
                hoverStyle: {
                    backgroundColor: "$errorDark",
                },
                pressStyle: {
                    backgroundColor: "$errorDark",
                },
                focusStyle: {
                    borderColor: "$error",
                    borderWidth: 2,
                    backgroundColor: "$error",
                },
            },
            warning: {
                backgroundColor: "$warning",
                color: "$textInverse",
                borderWidth: 0,
                hoverStyle: {
                    backgroundColor: "$warningDark",
                },
                pressStyle: {
                    backgroundColor: "$warningDark",
                },
                focusStyle: {
                    borderColor: "$warning",
                    borderWidth: 2,
                    backgroundColor: "$warning",
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
        tone: "primary",
    },
});

const BUTTON_SIZE_STYLES = {
    sm: {
        height: "$buttonSm",
        paddingHorizontal: "$3",
        paddingVertical: "$2",
        fontSize: "$3",
    },
    md: {
        height: "$buttonMd",
        paddingHorizontal: "$4",
        paddingVertical: "$3",
        fontSize: "$4",
    },
    lg: {
        height: "$buttonLg",
        paddingHorizontal: "$5",
        paddingVertical: "$3",
        fontSize: "$5",
    },
} as const;

type ButtonFrameProps = GetProps<typeof ButtonFrame> & Omit<TamaguiButtonProps, keyof GetProps<typeof ButtonFrame>>;

export type ButtonProps = Omit<ButtonFrameProps, "size"> & {
    size?: keyof typeof BUTTON_SIZE_STYLES;
};

type ButtonElement = ComponentRef<typeof ButtonFrame>;

export const Button = forwardRef<ButtonElement, ButtonProps>(
    ({ size = "md", ...rest }, ref) => {
        const sizeStyle = BUTTON_SIZE_STYLES[size] ?? BUTTON_SIZE_STYLES.md;
        return <ButtonFrame ref={ref} {...sizeStyle} {...rest} />;
    }
);

Button.displayName = "Button";
