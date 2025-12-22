"use client";

import { useState, useEffect } from "react";
import { Popover } from "@tamagui/popover";
import { Column, Text, Button, YStack } from "@buttergolf/ui";
import type { Product } from "../ProductDetailClient";

interface MakeOfferPopoverProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitOffer: (offerAmount: number) => Promise<void>;
  children: React.ReactNode;
}

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

  useEffect(() => {
    if (isOpen) {
      setOfferAmount("");
      setError("");
      setSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    const amount = Number.parseFloat(offerAmount);

    if (!offerAmount || Number.isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (amount >= product.price) {
      setError(`Must be less than £${product.price.toFixed(2)}`);
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await onSubmitOffer(amount);
      onOpenChange(false);
    } catch {
      setError("Failed to submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={onOpenChange}
      placement="top"
      offset={8}
      allowFlip
    >
      <Popover.Trigger asChild>
        {children}
      </Popover.Trigger>

      <Popover.Content
        backgroundColor="$surface"
        borderRadius="$lg"
        borderWidth={1}
        borderColor="$border"
        padding="$3"
        width={280}
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        animation="quick"
        elevate
      >
        <Popover.Arrow borderWidth={1} borderColor="$border" />
        
        <YStack gap="$3" width="100%">
          <Column gap="$2">
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "16px",
                  color: "#323232",
                  fontWeight: 500,
                }}
              >
                £
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Your offer"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                disabled={submitting}
                autoFocus
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 30px",
                  fontSize: "16px",
                  border: "1px solid #EDEDED",
                  borderRadius: "8px",
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

            {error && (
              <Text size="$2" color="$error">
                {error}
              </Text>
            )}
          </Column>

          <Button
            size="$4"
            borderRadius="$full"
            backgroundColor="$primary"
            color="$textInverse"
            onPress={handleSubmit}
            disabled={submitting || !offerAmount}
            width="100%"
          >
            {submitting ? "Submitting..." : "Submit offer"}
          </Button>
        </YStack>
      </Popover.Content>
    </Popover>
  );
}
