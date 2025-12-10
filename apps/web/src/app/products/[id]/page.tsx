import { notFound } from "next/navigation";
import ProductDetailClient, { type Product } from "./ProductDetailClient";
import { PageHero } from "@/app/_components/marketplace/PageHero";
import { TrustSection } from "@/app/_components/marketplace/TrustSection";
import { NewsletterSection } from "@/app/_components/marketplace/NewsletterSection";
import { FooterSection } from "@/app/_components/marketplace/FooterSection";
import { SimilarItemsSection } from "./_components/SimilarItemsSection";
import type { ProductCardData } from "@buttergolf/app";

export const dynamic = "force-dynamic";

async function getProduct(id: string): Promise<Product | null> {
  try {
    // In production, this would use the actual domain
    const baseUrl = process.env.SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function getSimilarProducts(id: string): Promise<ProductCardData[]> {
  try {
    const baseUrl = process.env.SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/products/${id}/similar`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error("Error fetching similar products:", error);
    return [];
  }
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

  // Fetch similar products
  const similarProducts = await getSimilarProducts(id);

  return (
    <>
      <PageHero />
      <ProductDetailClient product={product} />
      <SimilarItemsSection
        products={similarProducts}
        category={product.category?.name || "Products"}
      />
      <TrustSection />
      <NewsletterSection />
      <FooterSection />
    </>
  );
}
