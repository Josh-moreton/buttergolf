import { notFound } from 'next/navigation';
import { SeoJsonLd } from '@/components/seo';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';

async function getProduct(id: string) {
  try {
    // In production, this would use the actual domain
    const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return null;
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  // Generate structured data for the product
  const siteUrl = process.env.SITE_URL || 'https://buttergolf.com';
  
  if (product) {
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.title,
      "description": product.description,
      "image": product.images?.length > 0 ? product.images.map((img: any) => img.url) : [],
      "brand": product.brand ? {
        "@type": "Brand",
        "name": product.brand
      } : undefined,
      "model": product.model,
      "offers": {
        "@type": "Offer",
        "url": `${siteUrl}/products/${product.id}`,
        "priceCurrency": "GBP",
        "price": product.price,
        "availability": product.isSold 
          ? "https://schema.org/SoldOut" 
          : "https://schema.org/InStock",
        "itemCondition": product.condition === "new" 
          ? "https://schema.org/NewCondition"
          : product.condition === "like_new"
          ? "https://schema.org/RefurbishedCondition"
          : "https://schema.org/UsedCondition",
        "seller": {
          "@type": "Person",
          "name": product.user?.name || "Anonymous"
        }
      },
      "category": product.category?.name
    };

    return (
      <>
        <ProductDetailClient />
        <SeoJsonLd data={productSchema} />
      </>
    );
  }

  // If product not found, just render the client component which will handle the error
  return <ProductDetailClient />;
}
