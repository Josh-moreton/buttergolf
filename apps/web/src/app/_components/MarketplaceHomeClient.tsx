"use client";

import { Column } from "@buttergolf/ui";
import { HeroSectionNew } from "./marketplace/HeroSectionNew";
import { CategoriesSection } from "./marketplace/CategoriesSection";
import { RecentlyListedSection } from "./marketplace/RecentlyListedSection";
import { NewsletterSection } from "./marketplace/NewsletterSection";
import { FooterSection } from "./marketplace/FooterSection";

export default function MarketplaceHomeClient() {
  return (
    <Column>
      <HeroSectionNew />
      <CategoriesSection />
      <RecentlyListedSection />
      <NewsletterSection />
      <FooterSection />
    </Column>
  );
}
