"use client";

import { useLayoutEffect, useRef, useState, CSSProperties } from "react";
import { Platform } from "react-native";
import { Text as TamaguiText } from "@buttergolf/ui";

interface TypewriterHeroProps {
    text: string;
    speed?: number;
    showCursor?: boolean;
    delay?: number;
    className?: string;
    style?: CSSProperties;
    /** Accessibility label for screen readers (uses text if not provided) */
    ariaLabel?: string;
}

/**
 * Typewriter effect for hero sections
 * Desktop only - shows text immediately on mobile/app
 *
 * Classic typewriter animation with optional blinking cursor.
 * Handles text rendering internally - no need to pass children.
 *
 * Accessibility:
 * - Always renders full text in DOM with visibility control (SEO/screen reader friendly)
 * - Adds aria-label for proper pronunciation
 */
export function TypewriterHero({
    text,
    speed = 0.05,
    showCursor = true,
    delay = 0,
    className,
    style,
    ariaLabel,
}: Readonly<TypewriterHeroProps>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [displayText, setDisplayText] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);
    const isWeb = Platform.OS === "web";

    useLayoutEffect(() => {
        if (!isWeb || globalThis.window === undefined) {
            setDisplayText(text);
            return;
        }

        // Desktop only - skip animation on mobile/app
        const isDesktop = globalThis.innerWidth >= 1024;
        if (!isDesktop) {
            setDisplayText(text);
            setIsAnimating(false);
            return;
        }

        // Check for reduced motion preference
        const prefersReducedMotion = globalThis.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            setDisplayText(text);
            setIsAnimating(false);
            return;
        }

        // Store interval ID in outer scope for proper cleanup
        let intervalId: ReturnType<typeof setInterval> | undefined;

        // Delay before starting typewriter
        const startTimeout = setTimeout(() => {
            setIsAnimating(true);
            let index = 0;
            intervalId = setInterval(() => {
                if (index < text.length) {
                    setDisplayText(text.slice(0, index + 1));
                    index++;
                } else {
                    if (intervalId) clearInterval(intervalId);
                    setIsAnimating(false);
                }
            }, speed * 1000);
        }, delay * 1000);

        return () => {
            clearTimeout(startTimeout);
            if (intervalId) clearInterval(intervalId);
        };
    }, [text, speed, delay, isWeb]);

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

    // Always render for SEO/accessibility, control visibility with CSS
    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                ...style,
                visibility: displayText || !isAnimating ? "visible" : "hidden"
            }}
            aria-label={ariaLabel || text}
        >
            {displayText || text}
            {showCursor && isAnimating && (
                <span
                    style={{
                        marginLeft: "2px",
                    }}
                    className="typewriter-cursor"
                    aria-hidden="true"
                >
                    |
                </span>
            )}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @keyframes typewriter-blink {
                  0%, 50% { opacity: 1; }
                  51%, 100% { opacity: 0; }
                }
                .typewriter-cursor {
                  animation: typewriter-blink 1s infinite;
                }
              `,
                }}
            />
        </div>
    );
}
