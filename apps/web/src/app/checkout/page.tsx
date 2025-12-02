"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Column, Container, Spinner, Text, Row } from "@buttergolf/ui";
import { CheckoutFormSimple } from "./_components/CheckoutFormSimple";
import { OrderSummaryCard } from "./_components/OrderSummaryCard";
import { PageHero } from "../_components/marketplace/PageHero";
import { TrustSection } from "../_components/marketplace/TrustSection";
import { NewsletterSection } from "../_components/marketplace/NewsletterSection";
import { FooterSection } from "../_components/marketplace/FooterSection";

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  const [loading, setLoading] = useState(!!productId);
  const [error, setError] = useState<string | null>(
    !productId ? "No product selected" : null,
  );
  const [product, setProduct] = useState<{
    id: string;
    title: string;
    price: number;
    imageUrl: string | null;
  } | null>(null);

  useEffect(() => {
    if (!productId) {
      return;
    }

    // Just fetch product information, don't create payment intent yet
    fetch(`/api/products/${productId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Product not found");
        }
        return res.json();
      })
      .then((productData) => {
        setProduct({
          id: productData.id,
          title: productData.title,
          price: productData.price,
          imageUrl: productData.images?.[0]?.url || null,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setError("Product not found");
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return (
      <Container size="lg" paddingVertical="$2xl">
        <Column gap="$lg" alignItems="center" paddingVertical="$3xl">
          <Spinner size="lg" color="$primary" />
          <Text color="$textSecondary">Preparing checkout...</Text>
        </Column>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container size="lg" paddingVertical="$2xl">
        <Column gap="$lg" alignItems="center" paddingVertical="$3xl">
          <Text color="$error" size="$6" weight="semibold">
            {error || "Unable to load checkout"}
          </Text>
          <Text color="$textSecondary">
            Please try again or contact support if the issue persists.
          </Text>
        </Column>
      </Container>
    );
  }

  return (
    <>
      {/* Page Hero */}
      <PageHero />

      {/* Main Content - Two Column Layout */}
      <Container size="xl" paddingVertical="$2xl">
        <Row
          gap="$xl"
          width="100%"
          flexDirection="column"
          $gtSm={{ flexDirection: "row", alignItems: "flex-start" }}
          alignItems="stretch"
        >
          {/* Left Column - Checkout Form (66%) */}
          <Column flexBasis={0} flexGrow={2} flexShrink={1} minWidth={0}>
            <CheckoutFormSimple product={product} />
          </Column>

          {/* Right Column - Order Summary (33%) */}
          <Column flexBasis={0} flexGrow={1} flexShrink={1} minWidth={0}>
            <OrderSummaryCard product={product} />
          </Column>
        </Row>
      </Container>

      {/* Trust Section */}
      <TrustSection />

      {/* Newsletter */}
      <NewsletterSection />

      {/* Footer */}
      <FooterSection />
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <Container size="lg" paddingVertical="$2xl">
          <Column gap="$lg" alignItems="center" paddingVertical="$3xl">
            <Spinner size="lg" color="$primary" />
          </Column>
        </Container>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  );
}
