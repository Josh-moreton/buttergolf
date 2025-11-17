/**
 * AuthButton Component
 *
 * Specialized button variants for authentication actions (Login/Sign-up).
 * Based on ButterGolf design mockups with rounded pill shapes.
 *
 * @example
 * ```tsx
 * <AuthButton variant="login" onPress={handleLogin}>Log-in</AuthButton>
 * <AuthButton variant="signup" onPress={handleSignup}>Sign-up</AuthButton>
 * ```
 */

import { styled, GetProps } from "tamagui";
import { Button } from "./Button";

export const AuthButton = styled(Button, {
    name: "AuthButton",

    // Override base button to use rounded pill shape
    borderRadius: "$full",
    paddingHorizontal: "$6",
    fontWeight: "500",
    fontSize: "$4",
    letterSpacing: 0,

    variants: {
        variant: {
            login: {
                backgroundColor: "$primary",
                color: "$textInverse",
                borderWidth: 0,
                hoverStyle: {
                    backgroundColor: "$primaryHover",
                    opacity: 0.95,
                },
                pressStyle: {
                    backgroundColor: "$primaryPress",
                },
                focusStyle: {
                    backgroundColor: "$primaryFocus",
                    borderWidth: 2,
                    borderColor: "$primaryFocus",
                },
            },
            signup: {
                backgroundColor: "$cloudMist", // Cloud Mist - light background
                color: "$ironstone",
                borderWidth: 0,
                hoverStyle: {
                    backgroundColor: "$cloudMist",
                    opacity: 0.85,
                },
                pressStyle: {
                    backgroundColor: "$cloudMist",
                    opacity: 0.75,
                },
                focusStyle: {
                    backgroundColor: "$cloudMist",
                    borderWidth: 2,
                    borderColor: "$border",
                },
            },
        },
    } as const,

    defaultVariants: {
        variant: "login",
    },
});

export type AuthButtonProps = GetProps<typeof AuthButton>;
