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
                backgroundColor: "$secondary", // Burnt Olive - dark accent
                color: "$textInverse",
                borderWidth: 0,
                hoverStyle: {
                    backgroundColor: "$secondaryHover",
                    opacity: 0.95,
                },
                pressStyle: {
                    backgroundColor: "$secondaryPress",
                    opacity: 0.85,
                },
                focusStyle: {
                    backgroundColor: "$secondaryFocus",
                    borderWidth: 2,
                    borderColor: "$secondaryFocus",
                },
            },
        },
    } as const,

    defaultVariants: {
        variant: "login",
    },
});

export type AuthButtonProps = GetProps<typeof AuthButton>;
