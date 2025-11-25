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
 * Web-only animated version of FadeUpText
 * This component is only rendered on web, so it's safe to use window APIs
 */
function FadeUpTextWeb({
    text,
    delay = 0,
    className,
    style,
    ariaLabel,
}: FadeUpTextProps) {
    const [isVisible, setIsVisible] = useState(false);

    const prefersReducedMotion = useMemo(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }, []);

    const isDesktop = useMemo(() => {
        if (typeof window === "undefined") return false;
        return window.innerWidth >= 1024;
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay * 1000);

        return () => clearTimeout(timer);
    }, [delay]);

    // On mobile web or with reduced motion, show static text immediately
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
export function FadeUpText(props: FadeUpTextProps) {
    // On native, just return static text - no web APIs used
    if (Platform.OS !== "web") {
        return (
            <TamaguiText
                fontSize={props.style?.fontSize as number || 32}
                fontWeight={String(props.style?.fontWeight || "700")}
                color="$text"
            >
                {props.text}
            </TamaguiText>
        );
    }

    // On web, use the animated version
    return <FadeUpTextWeb {...props} />;
}
