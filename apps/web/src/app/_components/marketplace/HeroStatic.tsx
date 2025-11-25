"use client";

import { Hero } from "@buttergolf/app";
import { imagePaths } from "@buttergolf/assets";

/**
 * Static hero section for web marketplace
 * Uses cross-platform Hero component from @buttergolf/app
 *
 * Uses simple fade-up animation (Tamagui-based) on desktop only:
 * - Word-level animation with stagger effect
 * - Waits 0.6s for hero container fade-in to complete before animating text
 * - Mobile/app shows static text immediately for performance
 */
export function HeroStatic() {
    return (
        <Hero
            heading={{
                line1: "Butter Up Your Game",
            }}
            subtitle="The Marketplace to Buy, Sell & Upgrade"
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
            animationVariant="fade-up"
            animationDelay={0.6}
        />
    );
}