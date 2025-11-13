"use client";

import { useState } from "react";
import { Column } from "@buttergolf/ui";
import { HeroStatic } from "./marketplace/HeroStatic";
import { BuySellToggle } from "./marketplace/BuySellToggle";
import { CategoryGrid } from "./marketplace/CategoryGrid";
import { SellingPlaceholder } from "./marketplace/SellingPlaceholder";
import { RecentlyListedSectionClient } from "./marketplace/RecentlyListedSection";
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
      <HeroStatic />
      <BuySellToggle activeMode={activeMode} onModeChange={setActiveMode} />

      {/* Conditionally render based on active mode */}
      {activeMode === "buying" ? (
        <>
          <CategoryGrid />
          <RecentlyListedSectionClient products={products} />
        </>
      ) : (
        <SellingPlaceholder />
      )}

      <NewsletterSection />
      <FooterSection />
    </Column>
  );
}
