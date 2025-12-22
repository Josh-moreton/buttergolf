"use client";

import { useState, useEffect } from "react";
import { Column, Text, Button } from "@buttergolf/ui";
import type { Product } from "../ProductDetailClient";

interface MakeOfferModalProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitOffer: (offerAmount: number) => Promise<void>;
}

export function MakeOfferModal({
  product,
  isOpen,
  onOpenChange,
  onSubmitOffer,
}: MakeOfferModalProps) {
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => onOpenChange(false)}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 99999,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "24px",
          width: "320px",
          maxWidth: "90vw",
          zIndex: 100000,
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Column gap="$3" width="100%">
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text size="$6" fontWeight="600" color="$text">
              Make an offer
            </Text>
            <button
              onClick={() => onOpenChange(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                padding: "4px",
                color: "#666",
              }}
            >
              ✕
            </button>
          </div>

          {/* Input */}
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
                boxSizing: "border-box",
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
                if (e.key === "Escape") {
                  onOpenChange(false);
                }
              }}
            />
          </div>

          {error && (
            <Text size="$2" color="$error">
              {error}
            </Text>
          )}

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
        </Column>
      </div>
    </>
  );
}
