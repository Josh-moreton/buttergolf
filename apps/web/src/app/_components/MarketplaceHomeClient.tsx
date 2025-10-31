"use client"

import { HeroSection } from "./marketplace/HeroSection"
import { CategoriesSection } from "./marketplace/CategoriesSection"
import { RecentlyListedSection } from "./marketplace/RecentlyListedSection"
import { NewsletterSection } from "./marketplace/NewsletterSection"
import { FooterSection } from "./marketplace/FooterSection"

export default function MarketplaceHomeClient() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <RecentlyListedSection />
      <NewsletterSection />
      <FooterSection />
    </>
  )
}
