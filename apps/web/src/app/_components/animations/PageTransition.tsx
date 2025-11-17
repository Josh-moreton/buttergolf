"use client";

import { useLayoutEffect, useRef, type PropsWithChildren } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface PageTransitionProps extends PropsWithChildren {
    /**
     * Whether to disable animations (respects prefers-reduced-motion by default)
     */
    disableAnimations?: boolean;
}

/**
 * Web-only page transition animation wrapper that fades in and slides up content on scroll.
 *
 * Usage:
 * - Wrap page content in this component (typically in layout.tsx)
 * - Add className="page-transition" to sections that should animate when entering viewport
 *
 * Animation behavior:
 * - All sections animate when they enter the viewport using ScrollTrigger
 * - First section triggers immediately (start: "top bottom")
 * - Subsequent sections trigger at 75% viewport
 * - Respects prefers-reduced-motion user preference
 * - Cleans up GSAP context on unmount
 */
export function PageTransition({
    children,
    disableAnimations = false,
}: PageTransitionProps) {
    const rootRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!rootRef.current) return;

        // Ensure page starts at top on mount (prevents scroll position issues)
        window.scrollTo(0, 0);

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion || disableAnimations) {
            // Skip animations but ensure content is visible
            const allElements = rootRef.current.querySelectorAll(".page-transition");
            allElements.forEach((el) => {
                gsap.set(el, { opacity: 1, y: 0, clearProps: "all" });
            });
            return;
        }

        // Create GSAP context for cleanup
        const ctx = gsap.context(() => {
            const animatedElements = rootRef.current!.querySelectorAll(".page-transition");

            animatedElements.forEach((el, index) => {
                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    duration: 1.0,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        // First element triggers immediately, others at 75% viewport
                        start: index === 0 ? "top bottom" : "top 75%",
                        end: "top 50%",
                        toggleActions: "play none none reverse",
                        // markers: true, // Uncomment for debugging
                    },
                });
            });
        }, rootRef);

        // Cleanup function
        return () => {
            ctx.revert();
        };
    }, [disableAnimations]);

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                    .page-transition {
                        opacity: 0;
                        transform: translateY(50px);
                        will-change: opacity, transform;
                    }
                `
            }} />
            <div ref={rootRef} style={{ width: "100%" }}>
                {children}
            </div>
        </>
    );
}
