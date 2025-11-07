"use client";

import { Column } from "@buttergolf/ui";
import { HeroCarousel } from "./marketplace/HeroCarousel";
import { CategoryGrid } from "./marketplace/CategoryGrid";
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
  return (
    <Column>
      <HeroCarousel />
      <CategoryGrid />
      <RecentlyListedSectionClient products={products} />
      <NewsletterSection />
      <FooterSection />
    </Column>
  );
}
