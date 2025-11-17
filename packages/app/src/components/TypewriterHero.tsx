"use client";

import { useLayoutEffect, useRef, useState, ReactNode } from "react";

interface TypewriterHeroProps {
    text: string;
    speed?: number;
    showCursor?: boolean;
    delay?: number;
    className?: string;
    children?: ReactNode;
}

/**
 * Typewriter effect for hero sections
 * Desktop only - shows text immediately on mobile/app
 *
 * Classic typewriter animation with optional blinking cursor
 */
export function TypewriterHero({
    text,
    speed = 0.05,
    showCursor = true,
    delay = 0,
    className,
    children,
}: TypewriterHeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [displayText, setDisplayText] = useState("");
    const [showText, setShowText] = useState(false);

    useLayoutEffect(() => {
        if (typeof window === "undefined") return;

        // Desktop only - skip animation on mobile/app
        const isDesktop = window.innerWidth >= 1024;
        if (!isDesktop) {
            setDisplayText(text);
            setShowText(true);
            return;
        }

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            setDisplayText(text);
            setShowText(true);
            return;
        }

        // Delay before starting typewriter
        const startTimeout = setTimeout(() => {
            setShowText(true);
            let index = 0;
            const interval = setInterval(() => {
                if (index < text.length) {
                    setDisplayText(text.slice(0, index + 1));
                    index++;
                } else {
                    clearInterval(interval);
                }
            }, speed * 1000);

            return () => clearInterval(interval);
        }, delay * 1000);

        return () => {
            clearTimeout(startTimeout);
        };
    }, [text, speed, delay]);

    if (!showText) return null;

    return (
        <div ref={containerRef} className={className}>
            {children ? (
                children
            ) : (
                <>
                    {displayText}
                    {showCursor && (
                        <span
                            style={{
                                marginLeft: "2px",
                            }}
                            className="typewriter-cursor"
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
                </>
            )}
        </div>
    );
}
