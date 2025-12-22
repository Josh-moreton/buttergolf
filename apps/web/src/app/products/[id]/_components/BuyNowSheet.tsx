"use client";

import { useCallback, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import {
  Column,
  Row,
  Text,
  Button,
  Heading,
  Spinner,
  Image,
  Sheet,
  SheetOverlay,
  SheetFrame,
  SheetHandle,
} from "@buttergolf/ui";
import type { Product } from "../ProductDetailClient";

// Initialize Stripe outside component to avoid re-creating on every render
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface BuyNowSheetProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * BuyNowSheet component
 * 
 * A Tamagui Sheet with embedded Stripe checkout experience.
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
  console.log("[BuyNowSheet] Render - isOpen:", isOpen, "productId:", product.id);
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState(0);

  // Snap points: 40% for preview, 85% for checkout, 100% for full
  const snapPoints = [100, 85, 40];

  // Reset state when sheet opens
  useEffect(() => {
    console.log("[BuyNowSheet] useEffect triggered - isOpen:", isOpen);
    if (isOpen) {
      console.log("[BuyNowSheet] Sheet opened - resetting state");
      setError(null);
      setIsLoading(true);
      // Start at 85% snap point (index 1) for checkout
      setPosition(1);
    }
  }, [isOpen]);

  // Fetch client secret from our API
  const fetchClientSecret = useCallback(async () => {
    console.log("[BuyNowSheet] ========== fetchClientSecret START ==========");
    console.log("[BuyNowSheet] Product ID:", product.id);
    console.log("[BuyNowSheet] Product title:", product.title);
    console.log("[BuyNowSheet] Making POST to /api/checkout/create-checkout-session");
    
    try {
      const requestBody = JSON.stringify({ productId: product.id });
      console.log("[BuyNowSheet] Request body:", requestBody);
      
      const response = await fetch("/api/checkout/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      });

      console.log("[BuyNowSheet] Response received");
      console.log("[BuyNowSheet] Response status:", response.status);
      console.log("[BuyNowSheet] Response ok:", response.ok);
      console.log("[BuyNowSheet] Response headers:", Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("[BuyNowSheet] ERROR: Non-OK response");
        console.error("[BuyNowSheet] Error response body:", errorText);
        
        let errorMessage = "Failed to create checkout";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
          console.error("[BuyNowSheet] Parsed error message:", errorMessage);
        } catch {
          errorMessage = errorText || errorMessage;
          console.error("[BuyNowSheet] Raw error text:", errorMessage);
        }
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("[BuyNowSheet] SUCCESS: Response parsed");
      console.log("[BuyNowSheet] clientSecret present:", !!data.clientSecret);
      console.log("[BuyNowSheet] clientSecret length:", data.clientSecret?.length || 0);
      
      setIsLoading(false);
      console.log("[BuyNowSheet] ========== fetchClientSecret END ==========");
      return data.clientSecret;
    } catch (err) {
      console.error("[BuyNowSheet] ========== fetchClientSecret CATCH ==========");
      console.error("[BuyNowSheet] Caught error:", err);
      console.error("[BuyNowSheet] Error type:", err instanceof Error ? err.constructor.name : typeof err);
      console.error("[BuyNowSheet] Error message:", err instanceof Error ? err.message : String(err));
      
      const errorMessage =
        err instanceof Error ? err.message : "Failed to initialize checkout";
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [product.id, product.title]);

  // Handle checkout completion
  const handleComplete = useCallback(() => {
    console.log("Checkout completed");
    // Close the sheet - the return_url redirect will happen
    onOpenChange(false);
  }, [onOpenChange]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
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
        <Column flex={1} padding="$md">
          {error ? (
            <Column gap="$lg" alignItems="center" paddingVertical="$xl">
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
                  Unable to Load Checkout
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
            <>
              {isLoading && (
                <Column gap="$md" alignItems="center" paddingVertical="$xl">
                  <Spinner size="lg" color="$primary" />
                  <Text color="$textSecondary">Preparing secure checkout...</Text>
                </Column>
              )}

              <div style={{ display: isLoading ? 'none' : 'block', width: '100%' }}>
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={{
                    fetchClientSecret,
                    onComplete: handleComplete,
                  }}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </div>
            </>
          )}
        </Column>
      </SheetFrame>
    </Sheet>
  );
}
