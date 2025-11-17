"use client";

import { useLayoutEffect, useRef, type PropsWithChildren } from "react";
import { gsap } from "gsap";

interface PageLoadAnimationProps extends PropsWithChildren {
    /**
     * Delay before animation starts (in seconds)
     */
    delay?: number;
    /**
     * Whether to disable animations (respects prefers-reduced-motion by default)
     */
    disableAnimations?: boolean;
}

/**
 * Immediate page-load fade-in animation (no scroll trigger)
 *
 * Use this for above-the-fold content that should animate on page load:
 * - Hero sections
 * - Category grids
 * - Any content that's immediately visible
 *
 * For scroll-based animations, use PageTransition with .page-transition class instead.
 *
 * Animation behavior:
 * - Fades in and slides up immediately on mount
 * - No scroll triggering
 * - Respects prefers-reduced-motion
 * - Cleans up GSAP context on unmount
 */
export function PageLoadAnimation({
    children,
    delay = 0,
    disableAnimations = false,
}: PageLoadAnimationProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion || disableAnimations) {
            // Skip animations but ensure content is visible
            gsap.set(containerRef.current, { opacity: 1, y: 0, clearProps: "all" });
            return;
        }

        // Create GSAP context for cleanup
        const ctx = gsap.context(() => {
            gsap.fromTo(
                containerRef.current,
                {
                    opacity: 0,
                    y: 30,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    delay,
                }
            );
        }, containerRef);

        // Cleanup function
        return () => {
            ctx.revert();
        };
    }, [delay, disableAnimations]);

    return (
        <div
            ref={containerRef}
            style={{
                opacity: 0,
                willChange: "opacity, transform"
            }}
        >
            {children}
        </div>
    );
}
