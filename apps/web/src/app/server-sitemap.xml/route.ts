import { getServerSideSitemap } from 'next-sitemap';
import { prisma } from '@buttergolf/db';
import type { ISitemapField } from 'next-sitemap';

export async function GET() {
  // Fetch all products from the database
  const products = await prisma.product.findMany({
    where: {
      isSold: false, // Only include available products
    },
    select: {
      id: true,
      updatedAt: true,
    },
  });

  const siteUrl = process.env.SITE_URL || 'https://buttergolf.com';

  const fields: ISitemapField[] = [
    // Static pages
    {
      loc: siteUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'daily' as const,
      priority: 1.0,
    },
    {
      loc: `${siteUrl}/sell`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly' as const,
      priority: 0.9,
    },
    {
      loc: `${siteUrl}/rounds`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly' as const,
      priority: 0.6,
    },
    // Dynamic product pages
    ...products.map((product) => ({
      loc: `${siteUrl}/products/${product.id}`,
      lastmod: product.updatedAt.toISOString(),
      changefreq: 'weekly' as const,
      priority: 0.8,
    })),
  ];

  return getServerSideSitemap(fields);
}
