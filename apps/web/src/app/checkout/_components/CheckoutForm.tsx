"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PaymentElement,
  AddressElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button, Card, Column, Row, Text, Heading, Image } from "@buttergolf/ui";

interface CheckoutFormProps {
  product: {
    id: string;
    title: string;
    price: number;
    imageUrl: string | null;
  };
}

export function CheckoutForm({ product }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
      });

      if (error) {
        setErrorMessage(error.message || "An error occurred during payment");
        setIsProcessing(false);
      }
      // If successful, Stripe will redirect to return_url
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  const shippingCost = 9.99;
  const total = product.price + shippingCost;

  return (
    <Column gap="$lg" tag="form">
      <Column gap="$lg">
        <Heading level={2}>Checkout</Heading>

        {/* Product Summary */}
        <Card variant="outlined" padding="$lg">
          <Row gap="$md" alignItems="flex-start">
            {product.imageUrl && (
              <Image
                source={{ uri: product.imageUrl }}
                width={80}
                height={80}
                borderRadius="$md"
              />
            )}
            <Column gap="$xs" flex={1}>
              <Text size="lg" weight="semibold">
                {product.title}
              </Text>
              <Row gap="$md" justifyContent="space-between">
                <Text color="$textSecondary">Product</Text>
                <Text weight="medium">${product.price.toFixed(2)}</Text>
              </Row>
              <Row gap="$md" justifyContent="space-between">
                <Text color="$textSecondary">Shipping</Text>
                <Text weight="medium">${shippingCost.toFixed(2)}</Text>
              </Row>
              <Row
                gap="$md"
                justifyContent="space-between"
                paddingTop="$sm"
                borderTopWidth={1}
                borderTopColor="$border"
              >
                <Text weight="semibold">Total</Text>
                <Text weight="bold" size="lg" color="$primary">
                  ${total.toFixed(2)}
                </Text>
              </Row>
            </Column>
          </Row>
        </Card>

        {/* Shipping Address */}
        <Card variant="outlined" padding="$lg">
          <Column gap="$md">
            <Heading level={4}>Shipping Address</Heading>
            <AddressElement
              options={{
                mode: "shipping",
                allowedCountries: ["US"],
              }}
            />
          </Column>
        </Card>

        {/* Payment Details */}
        <Card variant="outlined" padding="$lg">
          <Column gap="$md">
            <Heading level={4}>Payment Details</Heading>
            <PaymentElement />
          </Column>
        </Card>

        {/* Error Message */}
        {errorMessage && (
          <Card variant="outlined" padding="$md">
            <Text color="$error">{errorMessage}</Text>
          </Card>
        )}

        {/* Submit Button */}
        <Button
          size="$5"
          backgroundColor="$primary"
          color="$textInverse"
          width="100%"
          onPress={handleSubmit as any}
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
        </Button>

        <Text size="sm" color="$textMuted" textAlign="center">
          Your payment is secure and encrypted. By completing this purchase, you
          agree to our terms of service.
        </Text>
      </Column>
    </Column>
  );
}
