"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Column,
  Row,
  Text,
  Button,
  Heading,
  Image,
  Sheet,
  SheetOverlay,
  SheetFrame,
  SheetHandle,
} from "@buttergolf/ui";
import { StripePaymentForm } from "@/app/checkout/_components/StripePaymentForm";
import type { Product } from "../ProductDetailClient";

interface BuyNowSheetProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * BuyNowSheet component
 * 
 * A Tamagui Sheet with Stripe PaymentElement checkout experience.
 * Uses PaymentElement instead of EmbeddedCheckout to work properly
 * inside a Portal/Sheet context.
 * 
 * Uses multiple snap points:
 * - 40% - Product preview / order summary
 * - 85% - Full checkout form
 * - 100% - Maximum expansion for smaller screens
 */
export function BuyNowSheet({
  product,
  isOpen,
  onOpenChange,
}: BuyNowSheetProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState(0);

  // Snap points: 40% for preview, 85% for checkout, 100% for full
  const snapPoints = [100, 85, 40];

  // Reset state when sheet opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      // Start at 85% snap point (index 1) for checkout
      setPosition(1);
    }
  }, [isOpen]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSuccess = useCallback((paymentIntentId: string) => {
    console.log("[BuyNowSheet] Payment succeeded:", paymentIntentId);
    onOpenChange(false);
    // Redirect to success page
    router.push(`/checkout/success?payment_intent=${paymentIntentId}`);
  }, [onOpenChange, router]);

  const handleError = useCallback((errorMessage: string) => {
    console.error("[BuyNowSheet] Payment error:", errorMessage);
    setError(errorMessage);
  }, []);

  const handleRetry = () => {
    setError(null);
  };

  const productImageUrl = product.images[0]?.url || null;

  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={onOpenChange}
      snapPoints={snapPoints}
      position={position}
      onPositionChange={setPosition}
      dismissOnSnapToBottom
      zIndex={100000}
      animation="medium"
    >
      <SheetOverlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
        backgroundColor="$overlayDark50"
      />
      <SheetFrame
        backgroundColor="$surface"
        borderTopLeftRadius="$xl"
        borderTopRightRadius="$xl"
        paddingBottom="$xl"
      >
        <SheetHandle backgroundColor="$border" marginTop="$sm" />

        {/* Header */}
        <Row
          padding="$md"
          paddingTop="$lg"
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth={1}
          borderBottomColor="$border"
        >
          <Heading level={4} color="$text">
            Checkout
          </Heading>
          <Button
            chromeless
            onPress={handleClose}
            backgroundColor="$surface"
            borderRadius="$full"
            width={40}
            height={40}
            alignItems="center"
            justifyContent="center"
            padding={0}
          >
            <Text size="$6" fontWeight="bold" color="$text">
              ✕
            </Text>
          </Button>
        </Row>

        {/* Order Summary */}
        <Column padding="$md" gap="$md" borderBottomWidth={1} borderBottomColor="$border">
          <Row gap="$md" alignItems="flex-start">
            {productImageUrl && (
              <Image
                source={{ uri: productImageUrl }}
                width={80}
                height={80}
                borderRadius="$md"
                alt={product.title}
              />
            )}
            <Column gap="$xs" flex={1}>
              <Text size="$5" fontWeight="600" numberOfLines={2} color="$text">
                {product.title}
              </Text>
              {product.brand && (
                <Text size="$3" color="$textSecondary">
                  {product.brand}
                </Text>
              )}
              <Text size="$3" color="$textSecondary">
                Condition: {product.condition.replace("_", " ")}
              </Text>
            </Column>
          </Row>

          <Row justifyContent="space-between" alignItems="center">
            <Text color="$textSecondary">Total</Text>
            <Text fontWeight="bold" size="$7" color="$primary">
              £{product.price.toFixed(2)}
            </Text>
          </Row>

          {/* Trust Badges - Compact */}
          <Row gap="$lg" flexWrap="wrap">
            <Row gap="$xs" alignItems="center">
              <Text size="$3">🔒</Text>
              <Text size="$2" color="$textSecondary">Secure checkout</Text>
            </Row>
            <Row gap="$xs" alignItems="center">
              <Text size="$3">📦</Text>
              <Text size="$2" color="$textSecondary">Tracked shipping</Text>
            </Row>
            <Row gap="$xs" alignItems="center">
              <Text size="$3">✅</Text>
              <Text size="$2" color="$textSecondary">Buyer protection</Text>
            </Row>
          </Row>
        </Column>

        {/* Stripe Checkout Area */}
        <Column flex={1}>
          {error ? (
            <Column gap="$lg" alignItems="center" paddingVertical="$xl" paddingHorizontal="$md">
              <Column
                backgroundColor="$errorLight"
                borderRadius="$full"
                padding="$lg"
                alignItems="center"
                justifyContent="center"
                width={64}
                height={64}
              >
                <Text size="$7" color="$error">
                  ✕
                </Text>
              </Column>
              <Column gap="$sm" alignItems="center">
                <Heading level={5} textAlign="center">
                  Unable to Complete Payment
                </Heading>
                <Text color="$textSecondary" textAlign="center">
                  {error}
                </Text>
              </Column>
              <Button
                size="$4"
                backgroundColor="$primary"
                color="$textInverse"
                onPress={handleRetry}
              >
                Try Again
              </Button>
            </Column>
          ) : (
            /* Only render the payment form when sheet is open to avoid premature API calls */
            isOpen && (
              <StripePaymentForm
                productId={product.id}
                productPrice={product.price}
                onSuccess={handleSuccess}
                onError={handleError}
                onCancel={handleClose}
              />
            )
          )}
        </Column>
      </SheetFrame>
    </Sheet>
  );
}
