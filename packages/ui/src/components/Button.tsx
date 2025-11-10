/**
 * Button Component
 *
 * Custom button built on YStack for React Native compatibility.
 * Tamagui's native Button component doesn't render properly on mobile.
 *
 * @example
 * ```tsx
 * <Button onPress={() => {}}>Click me</Button>
 * <Button variant="outline" onPress={() => {}}>Outline</Button>
 * ```
 */

import { styled, GetProps, YStack } from "tamagui";

export const Button = styled(YStack, {
    name: "Button",

    // Base button styles
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#E25F2F", // Butter Orange
    cursor: "pointer",

    // Interactive states
    pressStyle: {
        opacity: 0.8,
        scale: 0.98,
    },

    hoverStyle: {
        opacity: 0.9,
    },

    focusStyle: {
        borderColor: "#E25F2F",
        borderWidth: 2,
    },

    variants: {
        variant: {
            solid: {
                backgroundColor: "#E25F2F", // Butter Orange
            },
            outline: {
                backgroundColor: "transparent",
                borderWidth: 2,
                borderColor: "#E25F2F",
            },
            ghost: {
                backgroundColor: "transparent",
            },
        },

        size: {
            sm: {
                height: 40,
                paddingHorizontal: 12,
            },
            md: {
                height: 48,
                paddingHorizontal: 16,
            },
            lg: {
                height: 52,
                paddingHorizontal: 20,
            },
        },

        fullWidth: {
            true: {
                width: "100%",
            },
        },

        disabled: {
            true: {
                opacity: 0.5,
                cursor: "not-allowed",
            },
        },
    } as const,

    defaultVariants: {
        variant: "solid",
        size: "md",
    },
});

export type ButtonProps = GetProps<typeof Button>;
