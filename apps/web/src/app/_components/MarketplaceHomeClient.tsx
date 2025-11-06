"use client";

import { Column } from "@buttergolf/ui";
import { HeroCarousel } from "./marketplace/HeroCarousel";
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
    <Column marginTop={100} $sm={{ marginTop: 100 }} $lg={{ marginTop: 100 }}>
      <HeroCarousel />
      <RecentlyListedSectionClient products={products} />
      <NewsletterSection />
      <FooterSection />
    </Column>
  );
}
