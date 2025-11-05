import MarketplaceHomeClient from "./_components/MarketplaceHomeClient";
import { getRecentProducts } from "./actions/products";
import { SeoJsonLd } from "@/components/seo";

export const dynamic = "force-dynamic";

export default async function Page() {
  const products = await getRecentProducts(12);

  // Structured data for the home page
  const siteUrl = process.env.SITE_URL || 'https://buttergolf.com';
  
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ButterGolf",
    "url": siteUrl,
    "logo": `${siteUrl}/_assets/logo.png`,
    "description": "P2P Marketplace for Golf Equipment",
    "sameAs": [
      // Add social media profiles when available
    ]
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ButterGolf",
    "url": siteUrl,
    "description": "Buy and sell golf equipment with fellow golfers",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/products?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <MarketplaceHomeClient products={products} />
      <SeoJsonLd data={[organizationSchema, webSiteSchema]} />
    </>
  );
}
