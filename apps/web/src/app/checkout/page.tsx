"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Column, Container, Spinner, Text } from "@buttergolf/ui";
import { CheckoutForm } from "./_components/CheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("productId");

  const [clientSecret, setClientSecret] = useState<string | null>(null);
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

    // Create PaymentIntent on mount
    fetch("/api/checkout/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || "Failed to initialize checkout");
          });
        }
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
        setProduct(data.product);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error creating payment intent:", err);
        setError(err.message);
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

  if (error || !clientSecret || !product) {
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
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "flat",
            variables: {
              colorPrimary: "#E25F2F", // Butter Orange
              colorBackground: "#FEFAD6", // Cream
              colorText: "#1E1E1E", // Charcoal
              colorDanger: "#DC2626", // Error red
              borderRadius: "10px",
              fontFamily: "system-ui, sans-serif",
            },
          },
        }}
      >
        <CheckoutForm product={product} />
      </Elements>
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
