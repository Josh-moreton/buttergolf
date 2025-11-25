"use client";

import { useEffect, useState, useMemo } from "react";
import type { CSSProperties } from "react";
import { Text, View } from "@buttergolf/ui";
import type { ViewStyle } from "react-native";

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
 * Uses Tamagui's built-in animation system instead of GSAP
 * 
 * Desktop only - shows text immediately on mobile for performance
 * 
 * Replaces the complex split-character GSAP animation with a simpler
 * word-level fade-up animation using Tamagui enterStyle.
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

    // Check for reduced motion preference
    const prefersReducedMotion = useMemo(() => {
        if (globalThis.window === undefined) return false;
        return globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }, []);

    // Check if desktop (memoized, no state update)
    const isDesktop = useMemo(() => {
        if (globalThis.window === undefined) return false;
        return globalThis.innerWidth >= 1024;
    }, []);

    useEffect(() => {
        // Apply delay using vanilla JS setTimeout
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay * 1000); // Convert seconds to ms

        return () => clearTimeout(timer);
    }, [delay]);

    // Split text into words for staggered animation
    const words = text.split(" ");

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

    // Animated version: words fade up with staggered delays
    return (
        <View
            flexDirection="row"
            flexWrap="wrap"
            gap="$2"
            aria-label={ariaLabel ?? text}
            className={className}
            // Cast CSSProperties to ViewStyle for Tamagui compatibility
            style={style as unknown as ViewStyle}
        >
            {words.map((word, index) => (
                <View
                    key={`${word}-${index}`}
                    animation="medium"
                    enterStyle={{
                        opacity: 0,
                        y: 20,
                    }}
                    opacity={isVisible ? 1 : 0}
                    y={isVisible ? 0 : 20}
                    // Stagger each word by 60ms
                    animateOnly={['opacity', 'transform']}
                    style={{
                        // Use CSS transition-delay for stagger effect
                        transitionDelay: isVisible ? `${index * 60}ms` : '0ms',
                    }}
                >
                    <Text
                        fontWeight="700"
                        color="$ironstone"
                        // Inherit font size from parent style
                        style={{
                            fontSize: 'inherit',
                            lineHeight: 'inherit',
                        }}
                    >
                        {word}
                    </Text>
                </View>
            ))}
        </View>
    );
}
