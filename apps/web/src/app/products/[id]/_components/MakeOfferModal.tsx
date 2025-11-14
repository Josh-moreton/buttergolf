"use client";

import { useState } from "react";
import { Column, Row, Text, Button, Heading } from "@buttergolf/ui";
import type { Product } from "../ProductDetailClient";

interface MakeOfferModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
    onSubmitOffer: (offerAmount: number) => Promise<void>;
}

export function MakeOfferModal({
    product,
    isOpen,
    onClose,
    onSubmitOffer,
}: MakeOfferModalProps) {
    const [offerAmount, setOfferAmount] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async () => {
        const amount = parseFloat(offerAmount);

        // Validation
        if (!offerAmount || isNaN(amount) || amount <= 0) {
            setError("Please enter a valid offer amount");
            return;
        }

        if (amount >= product.price) {
            setError(`Offer must be less than listed price (£${product.price.toFixed(2)})`);
            return;
        }

        const minimumOffer = product.price * 0.5; // 50% of listed price
        if (amount < minimumOffer) {
            setError(`Offer must be at least £${minimumOffer.toFixed(2)} (50% of listed price)`);
            return;
        }

        setError("");
        setSubmitting(true);

        try {
            await onSubmitOffer(amount);
            // Success - close modal
            setOfferAmount("");
            onClose();
        } catch (err) {
            setError("Failed to submit offer. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            onClick={handleBackdropClick}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 10000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: "white",
                    borderRadius: "24px",
                    maxWidth: "600px",
                    width: "100%",
                    maxHeight: "90vh",
                    overflow: "auto",
                    position: "relative",
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: 24,
                        right: 24,
                        background: "transparent",
                        border: "none",
                        fontSize: "32px",
                        cursor: "pointer",
                        color: "#F45314",
                        lineHeight: 1,
                        padding: 0,
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    aria-label="Close modal"
                >
                    ✕
                </button>

                <Column gap="$xl" padding="$2xl">
                    {/* Header */}
                    <Heading level={2} color="$text">
                        Make an offer
                    </Heading>

                    {/* Product Info */}
                    <Row gap="$md" alignItems="center">
                        <img
                            src={product.images[0]?.url}
                            alt={product.title}
                            style={{
                                width: 80,
                                height: 80,
                                objectFit: "cover",
                                borderRadius: "12px",
                                backgroundColor: "#f5f5f5",
                            }}
                        />
                        <Column gap="$xs" flex={1}>
                            <Text weight="semibold" color="$text">
                                {product.title}
                            </Text>
                            <Text size="sm" color="$textSecondary">
                                Listed Price: £{product.price.toFixed(2)}
                            </Text>
                        </Column>
                    </Row>

                    {/* Divider */}
                    <div
                        style={{
                            height: 1,
                            backgroundColor: "#EDEDED",
                            width: "100%",
                        }}
                    />

                    {/* Offer Input */}
                    <Column gap="$md">
                        <Text weight="semibold" color="$text">
                            Your offer
                        </Text>
                        <div style={{ position: "relative" }}>
                            <span
                                style={{
                                    position: "absolute",
                                    left: 20,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    fontSize: "18px",
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
                                placeholder="Enter your offer amount"
                                value={offerAmount}
                                onChange={(e) => setOfferAmount(e.target.value)}
                                disabled={submitting}
                                style={{
                                    width: "100%",
                                    padding: "16px 20px 16px 40px",
                                    fontSize: "18px",
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
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <Text size="sm" color="$error">
                                {error}
                            </Text>
                        )}

                        {/* Helper Text */}
                        {/* Helper Text */}
            <Text size="sm" color="$ironstone">
              Minimum offer: £{(product.price * 0.5).toFixed(2)} (50% of listed price)
            </Text>
                    </Column>

                    {/* Submit Button */}
                    <Button
                        size="lg"
                        tone="primary"
                        borderRadius="$full"
                        paddingHorizontal="$6"
                        onPress={handleSubmit}
                        disabled={submitting || !offerAmount}
                        width="100%"
                    >
                        {submitting ? "Submitting..." : "Submit offer"}
                    </Button>
                </Column>
            </div>
        </div>
    );
}
