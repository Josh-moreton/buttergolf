import React from 'react';

type Json = Record<string, any>;

/**
 * Component for injecting structured data (JSON-LD) into the page.
 * Used for SEO and enabling rich results in search engines.
 * 
 * @example
 * ```tsx
 * <SeoJsonLd data={{
 *   "@context": "https://schema.org",
 *   "@type": "Organization",
 *   "name": "ButterGolf"
 * }} />
 * ```
 */
export function SeoJsonLd({ data }: { data: Json | Json[] }) {
  const payload = Array.isArray(data) ? data : [data];
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
