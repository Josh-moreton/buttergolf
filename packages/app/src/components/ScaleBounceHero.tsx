"use client";

import { useLayoutEffect, useRef, ReactNode } from "react";

interface ScaleBounceHeroProps {
    text: string;
    delay?: number;
    className?: string;
    children?: ReactNode;
}

/**
 * Scale + bounce animation for hero sections
 * Desktop only - shows text immediately on mobile/app
 *
 * Fun and playful elastic bounce effect
 */
export function ScaleBounceHero({
    text,
    delay = 0,
    className,
    children,
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

        // Dynamically import GSAP only on desktop
        let ctx: ReturnType<typeof import("gsap").gsap.context> | undefined;
        import("gsap").then(({ gsap }) => {
            if (!containerRef.current) return;

            ctx = gsap.context(() => {
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
        });

        return () => {
            ctx?.revert();
        };
    }, [text, delay]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                opacity: 0,
                transformOrigin: "center",
                willChange: "transform, opacity",
            }}
        >
            {children || text}
        </div>
    );
}
