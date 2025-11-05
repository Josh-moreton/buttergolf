import { notFound } from 'next/navigation';
import { SeoJsonLd } from '@/components/seo';
import ProductDetailClient, { type Product } from './ProductDetailClient';

export const dynamic = 'force-dynamic';

async function getProduct(id: string): Promise<Product | null> {
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

function generateProductSchema(product: Product, siteUrl: string) {
  // Map product condition to Schema.org itemCondition
  let itemCondition = "https://schema.org/UsedCondition";
  if (product.condition === "new") {
    itemCondition = "https://schema.org/NewCondition";
  } else if (product.condition === "like_new") {
    itemCondition = "https://schema.org/RefurbishedCondition";
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.images?.length > 0 ? product.images.map((img) => img.url) : [],
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
      "itemCondition": itemCondition,
      "seller": {
        "@type": "Person",
        "name": product.user?.name || "Anonymous"
      }
    },
    "category": product.category?.name
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  // If product not found, show 404
  if (!product) {
    notFound();
  }

  // Generate structured data for the product
  const siteUrl = process.env.SITE_URL || 'https://buttergolf.com';
  const productSchema = generateProductSchema(product, siteUrl);

  return (
    <>
      <ProductDetailClient product={product} />
      <SeoJsonLd data={productSchema} />
    </>
  );
}
