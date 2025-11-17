"use client";

import { useLayoutEffect, useRef, CSSProperties } from "react";
import { gsap } from "gsap";

interface AnimatedHeroTextProps {
    text: string;
    delay?: number;
    className?: string;
    style?: CSSProperties;
    /** Accessibility label for screen readers (uses text if not provided) */
    ariaLabel?: string;
}

/**
 * Split-character text animation for hero sections
 * Desktop only - animations disabled on mobile/app for performance
 *
 * Handles character splitting internally - no need to pass children.
 * Add styling via className or style props.
 *
 * Accessibility:
 * - Adds aria-label automatically for proper screen reader pronunciation
 * - Each character is wrapped in span but parent announces full text
 *
 * Follows patterns from PageTransition.tsx:
 * - Uses gsap.context() for cleanup
 * - Respects prefers-reduced-motion
 * - Desktop viewport detection (>= 1024px)
 */
export function AnimatedHeroText({
    text,
    delay = 0,
    className,
    style,
    ariaLabel,
}: AnimatedHeroTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!containerRef.current) return;
        if (typeof window === "undefined") return;

        // Desktop only - skip animation on mobile/app
        const isDesktop = window.innerWidth >= 1024;
        if (!isDesktop) {
            // Show text immediately on mobile
            if (containerRef.current) {
                const chars = containerRef.current.querySelectorAll(".char");
                chars.forEach((char) => {
                    (char as HTMLElement).style.opacity = "1";
                    (char as HTMLElement).style.transform = "none";
                });
            }
            return;
        }

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            const chars = containerRef.current.querySelectorAll(".char");
            chars.forEach((char) => {
                (char as HTMLElement).style.opacity = "1";
                (char as HTMLElement).style.transform = "none";
            });
            return;
        }

        // Animate characters with GSAP
        const ctx = gsap.context(() => {
            const chars = containerRef.current!.querySelectorAll(".char");

            // Split-character animation with stagger
            gsap.fromTo(
                chars,
                {
                    opacity: 0,
                    y: 30,
                    rotationX: -45,
                },
                {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 0.6,
                    ease: "back.out(1.4)",
                    stagger: {
                        amount: 0.4, // Total stagger duration (hardcoded for performance)
                        from: "start",
                    },
                    delay,
                }
            );
        }, containerRef);

        return () => {
            ctx.revert();
        };
    }, [delay]); // Removed 'text' - not used in effect logic

    // Split text into characters
    const characters = text.split("").map((char, i) => (
        <span
            key={i}
            className="char"
            style={{
                display: "inline-block",
                opacity: 0,
                ...(char === " " ? { whiteSpace: "pre" as const } : {}),
                willChange: "transform, opacity",
            }}
        >
            {char === " " ? "\u00A0" : char}
        </span>
    ));

    return (
        <div
            ref={containerRef}
            className={className}
            style={style}
            aria-label={ariaLabel || text}
        >
            {characters}
        </div>
    );
}
