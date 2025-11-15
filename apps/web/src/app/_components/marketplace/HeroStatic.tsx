"use client";

import { Hero } from "@buttergolf/app";
import { imagePaths } from "@buttergolf/assets";

/**
 * Static hero section for web marketplace
 * Uses cross-platform Hero component from @buttergolf/app
 */
export function HeroStatic() {
    return (
        <Hero
            heading={{
                line1: "Swing Smarter.",
                line2: "Shop Better.",
            }}
            subtitle="Buy, Sell, and Upgrade Your Game"
            primaryCta={{
                label: "Sell now",
                href: "/sell",
            }}
            secondaryCta={{
                label: "Shop now",
                href: "/listings",
            }}
            backgroundImage={imagePaths.hero.background}
            heroImage={imagePaths.hero.club}
            showHeroImage={true}
        />
    );
}