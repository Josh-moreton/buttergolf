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
      {/* Hero - No animation class, should be immediately visible */}
      <HeroStatic />

      {/* Buy/Sell Toggle - Above the fold, no animation */}
      <BuySellToggle activeMode={activeMode} onModeChange={setActiveMode} />

      {/* Conditionally render based on active mode */}
      {activeMode === "buying" ? (
        <>
          {/* Categories Section - Above the fold, no animation */}
          <CategoriesSection />
          
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
