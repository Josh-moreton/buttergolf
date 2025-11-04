"use client";

import { Column } from "@buttergolf/ui";
import { HeroSectionNew } from "./marketplace/HeroSectionNew";
import { RecentlyListedSectionClient } from "./marketplace/RecentlyListedSection";
import { NewsletterSection } from "./marketplace/NewsletterSection";
import { FooterSection } from "./marketplace/FooterSection";
import type { ProductCardData } from "@buttergolf/app";

interface MarketplaceHomeClientProps {
  products: ProductCardData[];
}

export default function MarketplaceHomeClient({
  products,
}: MarketplaceHomeClientProps) {
  return (
    <Column>
      <HeroSectionNew />
      <RecentlyListedSectionClient products={products} />
      <NewsletterSection />
      <FooterSection />
    </Column>
  );
}
