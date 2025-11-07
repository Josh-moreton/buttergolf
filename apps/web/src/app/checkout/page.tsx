"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Column, Container, Spinner, Text } from "@buttergolf/ui";
import { CheckoutForm } from "./_components/ImprovedCheckoutFormV2";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("productId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<{
    id: string;
    title: string;
    price: number;
    imageUrl: string | null;
  } | null>(null);

  useEffect(() => {
    if (!productId) {
      setError("No product selected");
      setLoading(false);
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
          <Text color="$error" size="lg" weight="semibold">
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
    <Container size="md" paddingVertical="$2xl">
      {/* We don't need Elements wrapper initially since we create payment intent later */}
      <CheckoutForm product={product} />
    </Container>
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
