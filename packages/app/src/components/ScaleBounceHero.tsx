"use client";

import { useLayoutEffect, useRef, CSSProperties } from "react";
import { gsap } from "gsap";

interface ScaleBounceHeroProps {
    text: string;
    delay?: number;
    className?: string;
    style?: CSSProperties;
    /** Accessibility label for screen readers (uses text if not provided) */
    ariaLabel?: string;
}

/**
 * Scale + bounce animation for hero sections
 * Desktop only - shows text immediately on mobile/app
 *
 * Fun and playful elastic bounce effect.
 * Handles text rendering internally - no need to pass children.
 * Add styling via className or style props.
 */
export function ScaleBounceHero({
    text,
    delay = 0,
    className,
    style,
    ariaLabel,
}: ScaleBounceHeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!containerRef.current) return;
        if (typeof window === "undefined") return;

        // Desktop only - skip animation on mobile/app
        const isDesktop = window.innerWidth >= 1024;
        if (!isDesktop) {
            if (containerRef.current) {
                containerRef.current.style.opacity = "1";
                containerRef.current.style.transform = "none";
            }
            return;
        }

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            containerRef.current.style.opacity = "1";
            containerRef.current.style.transform = "none";
            return;
        }

        // Animate with GSAP
        const ctx = gsap.context(() => {
            gsap.fromTo(
                containerRef.current,
                {
                    opacity: 0,
                    scale: 0.5,
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1.2,
                    ease: "elastic.out(1, 0.5)",
                    delay,
                }
            );
        }, containerRef);

        return () => {
            ctx.revert();
        };
    }, [delay]); // Removed 'text' - not used in effect logic

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                opacity: 0,
                transformOrigin: "center",
                willChange: "transform, opacity",
                ...style,
            }}
            aria-label={ariaLabel || text}
        >
            {text}
        </div>
    );
}
