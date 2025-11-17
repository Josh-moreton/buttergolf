"use client";

import { useState } from "react";
import { Column } from "@buttergolf/ui";
import { HeroStatic } from "./marketplace/HeroStatic";
import { BuySellToggle } from "./marketplace/BuySellToggle";
import { CategoriesSection } from "./marketplace/CategoriesSection";
import { SellingPlaceholder } from "./marketplace/SellingPlaceholder";
import { RecentlyListedSectionClient } from "./marketplace/RecentlyListedSection";
import { TrustSection } from "./marketplace/TrustSection";
import { NewsletterSection } from "./marketplace/NewsletterSection";
import { FooterSection } from "./marketplace/FooterSection";
import { PageLoadAnimation } from "./animations/PageLoadAnimation";
import type { ProductCardData } from "@buttergolf/app";

interface MarketplaceHomeClientProps {
  readonly products: ProductCardData[];
}

export default function MarketplaceHomeClient({
  products,
}: Readonly<MarketplaceHomeClientProps>) {
  const [activeMode, setActiveMode] = useState<"buying" | "selling">("buying");

  return (
    <Column>
      {/* Hero - Immediate page load animation (no scroll trigger) */}
      <PageLoadAnimation delay={0}>
        <HeroStatic />
      </PageLoadAnimation>

      {/* Buy/Sell Toggle - Immediate page load animation */}
      <PageLoadAnimation delay={0.2}>
        <BuySellToggle activeMode={activeMode} onModeChange={setActiveMode} />
      </PageLoadAnimation>

      {/* Conditionally render based on active mode */}
      {activeMode === "buying" ? (
        <>
          {/* Categories Section - Immediate page load animation */}
          <PageLoadAnimation delay={0.4}>
            <CategoriesSection />
          </PageLoadAnimation>

          {/* Below the fold sections - animate on scroll */}
          <div className="page-transition">
            <RecentlyListedSectionClient products={products} />
          </div>
          <div className="page-transition">
            <TrustSection />
          </div>
        </>
      ) : (
        <div className="page-transition">
          <SellingPlaceholder />
        </div>
      )}

      <div className="page-transition">
        <NewsletterSection />
      </div>
      <FooterSection />
    </Column>
  );
}
