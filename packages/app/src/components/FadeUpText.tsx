"use client";

import { useEffect, useState, useMemo } from "react";
import type { CSSProperties } from "react";
import { Platform } from "react-native";
import { Text as TamaguiText } from "@buttergolf/ui";

interface FadeUpTextProps {
    readonly text: string;
    readonly delay?: number;
    readonly className?: string;
    readonly style?: CSSProperties;
    /** Accessibility label for screen readers (uses text if not provided) */
    readonly ariaLabel?: string;
}

/**
 * Simple fade-up text animation for hero sections
 * Uses CSS transitions instead of GSAP for simplicity
 * 
 * Desktop only - shows text immediately on mobile for performance
 * 
 * Replaces the complex split-character GSAP animation with a simpler
 * fade-up animation using CSS transitions.
 * 
 * Accessibility:
 * - Adds aria-label automatically for proper screen reader pronunciation
 */
export function FadeUpText({
    text,
    delay = 0,
    className,
    style,
    ariaLabel,
}: FadeUpTextProps) {
    const [isVisible, setIsVisible] = useState(false);
    const isWeb = Platform.OS === "web";

    // Check for reduced motion preference (web only)
    const prefersReducedMotion = useMemo(() => {
        if (!isWeb || globalThis.window === undefined) return false;
        return globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }, [isWeb]);

    // Check if desktop (memoized, no state update)
    const isDesktop = useMemo(() => {
        if (!isWeb || globalThis.window === undefined) return false;
        return globalThis.innerWidth >= 1024;
    }, [isWeb]);

    useEffect(() => {
        if (!isWeb) return;
        
        // Apply delay using vanilla JS setTimeout
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay * 1000); // Convert seconds to ms

        return () => clearTimeout(timer);
    }, [delay, isWeb]);

    // On native, just return static text
    if (!isWeb) {
        return (
            <TamaguiText
                fontSize={style?.fontSize as number || 32}
                fontWeight={String(style?.fontWeight || "700")}
                color="$text"
            >
                {text}
            </TamaguiText>
        );
    }

    // On mobile or with reduced motion, show static text immediately
    if (!isDesktop || prefersReducedMotion) {
        return (
            <div
                className={className}
                style={style}
                aria-label={ariaLabel ?? text}
            >
                {text}
            </div>
        );
    }

    // Animated version: simple fade-up with CSS transition
    return (
        <div
            className={className}
            style={{
                ...style,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
            }}
            aria-label={ariaLabel ?? text}
        >
            {text}
        </div>
    );
}
