/**
 * AuthModal Component (Web Only)
 *
 * Reusable modal wrapper for Clerk authentication forms.
 * Provides consistent styling with backdrop blur, rounded corners, and drop shadow.
 * Closes on backdrop click or Escape key.
 *
 * NOTE: This component uses web-only DOM APIs (document.body, document.addEventListener)
 * and is therefore placed in the web app rather than the cross-platform UI package.
 *
 * @example
 * ```tsx
 * <AuthModal open={isOpen} onClose={handleClose}>
 *   <SignIn />
 * </AuthModal>
 * ```
 */

"use client";

import { useEffect, type ReactNode } from "react";
import { Column } from "@buttergolf/ui";

export interface AuthModalProps {
    /** Whether the modal is open */
    open: boolean;
    /** Callback when modal should close */
    onClose: () => void;
    /** Modal content (typically Clerk SignIn/SignUp component) */
    children: ReactNode;
}

export function AuthModal({ open, onClose, children }: AuthModalProps) {
    // Handle Escape key and body scroll lock
    useEffect(() => {
        if (!open) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEscape);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = previousOverflow;
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <Column
            {...{
                style: {
                    position: "fixed",
                    inset: 0,
                    backdropFilter: "blur(6px)",
                } as React.CSSProperties,
            }}
            backgroundColor="rgba(0,0,0,0.35)"
            zIndex={100}
            alignItems="center"
            justifyContent="center"
            onPress={onClose} // Close on backdrop click
        >
            {/* Content wrapper - prevents backdrop clicks from propagating */}
            <Column
                onPress={(e) => e.stopPropagation()}
                backgroundColor="$surface"
                borderRadius="$2xl"
                shadowColor="$shadowColorHover"
                shadowRadius={24}
                shadowOffset={{ width: 0, height: 12 }}
                shadowOpacity={0.3}
                overflow="hidden"
            >
                {children}
            </Column>
        </Column>
    );
}
