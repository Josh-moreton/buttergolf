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
      <div className="home-fade-in">
        <HeroStatic />
      </div>
      <div className="home-fade-in">
        <BuySellToggle activeMode={activeMode} onModeChange={setActiveMode} />
      </div>

      {/* Conditionally render based on active mode */}
      {activeMode === "buying" ? (
        <>
          <div className="home-fade-in">
            <CategoriesSection />
          </div>
          <div className="home-fade-in">
            <RecentlyListedSectionClient products={products} />
          </div>
          <div className="home-fade-in">
            <TrustSection />
          </div>
        </>
      ) : (
        <div className="home-fade-in">
          <SellingPlaceholder />
        </div>
      )}

      <div className="home-fade-in">
        <NewsletterSection />
      </div>
      <FooterSection />
    </Column>
  );
}
