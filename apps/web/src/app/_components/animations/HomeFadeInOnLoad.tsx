"use client";

import { useLayoutEffect, useRef, type PropsWithChildren } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface HomeFadeInOnLoadProps extends PropsWithChildren {
    /**
     * Whether to disable animations (respects prefers-reduced-motion by default)
     */
    disableAnimations?: boolean;
}

/**
 * Web-only animation wrapper that fades in and slides up content on page load.
 *
 * Usage:
 * - Wrap page content in this component
 * - Add className="home-fade-in" to sections that should animate on load
 * - Add className="home-fade-in-scroll" to sections that should animate on scroll
 *
 * Animation behavior:
 * - Sections with "home-fade-in" animate immediately on mount with stagger
 * - Sections with "home-fade-in-scroll" animate when they enter viewport
 * - Respects prefers-reduced-motion user preference
 * - Cleans up GSAP context on unmount
 */
export function HomeFadeInOnLoad({
    children,
    disableAnimations = false,
}: HomeFadeInOnLoadProps) {
    const rootRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!rootRef.current) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion || disableAnimations) {
            // Skip animations but ensure content is visible
            const allElements = rootRef.current.querySelectorAll(
                ".home-fade-in, .home-fade-in-scroll"
            );
            allElements.forEach((el) => {
                gsap.set(el, { opacity: 1, y: 0 });
            });
            return;
        }

        // Create GSAP context for cleanup
        const ctx = gsap.context(() => {
            // Animate immediate sections (hero, toggle, categories, etc.)
            const immediateElements = rootRef.current!.querySelectorAll(".home-fade-in");

            if (immediateElements.length > 0) {
                gsap.fromTo(
                    immediateElements,
                    {
                        opacity: 0,
                        y: 40,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "power2.out",
                        stagger: 0.1,
                    }
                );
            }

            // Animate scroll-triggered sections (trust badges, newsletter)
            const scrollElements = rootRef.current!.querySelectorAll(".home-fade-in-scroll");

            scrollElements.forEach((el) => {
                gsap.fromTo(
                    el,
                    {
                        opacity: 0,
                        y: 60,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 80%", // Start when element is 80% down the viewport
                            end: "top 50%",   // Complete when element is 50% down
                            toggleActions: "play none none reverse",
                            // markers: true, // Uncomment for debugging
                        },
                    }
                );
            });
        }, rootRef);

        // Cleanup function
        return () => {
            ctx.revert();
        };
    }, [disableAnimations]);

    return (
        <div ref={rootRef} style={{ width: "100%" }}>
            {children}
        </div>
    );
}
