"use client";

import { useState, useEffect } from "react";
import {
  Column,
  Row,
  Text,
  Button,
  Heading,
  Image,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Sheet,
  SheetOverlay,
  SheetFrame,
  SheetHandle,
} from "@buttergolf/ui";
import type { Product } from "../ProductDetailClient";

interface MakeOfferPopoverProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitOffer: (offerAmount: number) => Promise<void>;
  children: React.ReactNode; // The trigger button
}

/**
 * MakeOfferPopover component
 * 
 * Uses Tamagui Popover on desktop for a lightweight feel,
 * and Tamagui Sheet on mobile for better UX on small screens.
 */
export function MakeOfferPopover({
  product,
  isOpen,
  onOpenChange,
  onSubmitOffer,
  children,
}: MakeOfferPopoverProps) {
  const [offerAmount, setOfferAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile breakpoint
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Reset state when popover opens
  useEffect(() => {
    if (isOpen) {
      setOfferAmount("");
      setError("");
      setSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    const amount = Number.parseFloat(offerAmount);

    // Validation
    if (!offerAmount || Number.isNaN(amount) || amount <= 0) {
      setError("Please enter a valid offer amount");
      return;
    }

    if (amount >= product.price) {
      setError(
        `Offer must be less than listed price (£${product.price.toFixed(2)})`
      );
      return;
    }

    const minimumOffer = product.price * 0.5;
    if (amount < minimumOffer) {
      setError(
        `Offer must be at least £${minimumOffer.toFixed(2)} (50% of listed price)`
      );
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await onSubmitOffer(amount);
      setOfferAmount("");
      onOpenChange(false);
    } catch {
      setError("Failed to submit offer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const productImageUrl = product.images[0]?.url || null;

  // Shared offer form content
  const OfferForm = () => (
    <Column gap="$md" padding="$lg" width="100%">
      {/* Header */}
      <Row justifyContent="space-between" alignItems="center">
        <Heading level={4} color="$text">
          Make an offer
        </Heading>
        {isMobile && (
          <Button
            chromeless
            onPress={() => onOpenChange(false)}
            backgroundColor="$surface"
            borderRadius="$full"
            width={36}
            height={36}
            alignItems="center"
            justifyContent="center"
            padding={0}
          >
            <Text size="$5" fontWeight="bold" color="$text">
              ✕
            </Text>
          </Button>
        )}
      </Row>

      {/* Product Info - Compact */}
      <Row gap="$sm" alignItems="center" paddingBottom="$sm" borderBottomWidth={1} borderBottomColor="$border">
        {productImageUrl ? (
          <Image
            source={{ uri: productImageUrl }}
            width={48}
            height={48}
            borderRadius="$sm"
            alt={product.title}
          />
        ) : (
          <Column
            width={48}
            height={48}
            borderRadius="$sm"
            backgroundColor="$cloudMist"
            alignItems="center"
            justifyContent="center"
          >
            <Text size="$5">📦</Text>
          </Column>
        )}
        <Column gap="$xs" flex={1}>
          <Text size="$3" fontWeight="600" numberOfLines={1} color="$text">
            {product.title}
          </Text>
          <Text size="$2" color="$textSecondary">
            Listed: £{product.price.toFixed(2)}
          </Text>
        </Column>
      </Row>

      {/* Offer Input */}
      <Column gap="$sm">
        <Text size="$3" fontWeight="600" color="$text">
          Your offer
        </Text>
        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "16px",
              color: "#323232",
              fontWeight: 500,
              zIndex: 1,
            }}
          >
            £
          </span>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Enter amount"
            value={offerAmount}
            onChange={(e) => setOfferAmount(e.target.value)}
            disabled={submitting}
            style={{
              width: "100%",
              padding: "12px 16px 12px 32px",
              fontSize: "16px",
              border: "1px solid #EDEDED",
              borderRadius: "100px",
              outline: "none",
              fontFamily: "var(--font-urbanist)",
              backgroundColor: "white",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#F45314";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#EDEDED";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !submitting) {
                handleSubmit();
              }
            }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <Text size="$2" color="$error">
            {error}
          </Text>
        )}

        {/* Helper Text */}
        <Text size="$2" color="$textSecondary">
          Min: £{(product.price * 0.5).toFixed(2)} (50% of price)
        </Text>
      </Column>

      {/* Submit Button */}
      <Button
        size="$4"
        borderRadius="$full"
        paddingHorizontal="$5"
        backgroundColor="$primary"
        color="$textInverse"
        onPress={handleSubmit}
        disabled={submitting || !offerAmount}
        width="100%"
      >
        {submitting ? "Submitting..." : "Submit offer"}
      </Button>
    </Column>
  );

  // Mobile: Use Sheet
  if (isMobile) {
    return (
      <>
        {/* Render trigger directly */}
        <div onClick={() => onOpenChange(true)}>
          {children}
        </div>
        
        <Sheet
          modal
          open={isOpen}
          onOpenChange={onOpenChange}
          snapPoints={[50]}
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
            <OfferForm />
          </SheetFrame>
        </Sheet>
      </>
    );
  }

  // Desktop: Use Popover
  return (
    <Popover
      open={isOpen}
      onOpenChange={onOpenChange}
      placement="top"
      offset={8}
    >
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        backgroundColor="$surface"
        borderRadius="$lg"
        borderWidth={1}
        borderColor="$border"
        shadowColor="$shadowColor"
        shadowRadius={16}
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.15}
        width={320}
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        animation="quick"
        elevate
      >
        <OfferForm />
      </PopoverContent>
    </Popover>
  );
}
