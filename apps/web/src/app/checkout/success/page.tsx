"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Column,
  Text,
  Heading,
  Button,
  Card,
  Spinner,
  Row,
  Image,
} from "@buttergolf/ui";
import Link from "next/link";

interface OrderDetails {
  id: string;
  productTitle: string;
  productImage: string | null;
  productBrand: string | null;
  amountTotal: number;
  shippingCost: number;
  trackingCode: string | null;
  trackingUrl: string | null;
  carrier: string | null;
  service: string | null;
  orderStatus: string;
  shipmentStatus: string;
  sellerName: string;
  shippingAddress: {
    name: string;
    street1: string;
    street2: string | null;
    city: string;
    state: string | null;
    zip: string;
    country: string;
  };
  createdAt: string;
}

interface ApiResponse {
  status: "complete" | "processing";
  order?: OrderDetails;
  message?: string;
  error?: string;
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);

  const fetchOrder = useCallback(async () => {
    if (!sessionId) {
      setError("No session ID provided");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/orders/by-session/${sessionId}`);
      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch order details");
      }

      if (data.status === "processing") {
        // Order is still being processed, poll again
        setProcessing(true);
        setLoading(false);
        return false; // Indicate we should keep polling
      }

      if (data.status === "complete" && data.order) {
        setOrder(data.order);
        setProcessing(false);
        setLoading(false);
        return true; // Order found, stop polling
      }

      throw new Error("Unexpected response");
    } catch (err) {
      console.error("Error fetching order:", err);
      setError(err instanceof Error ? err.message : "Unable to load order details");
      setLoading(false);
      return true; // Stop polling on error
    }
  }, [sessionId]);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;

    const startFetching = async () => {
      const done = await fetchOrder();
      
      // If order is still processing, poll every 2 seconds (max 15 times = 30 seconds)
      if (!done && pollCount < 15) {
        pollInterval = setTimeout(() => {
          setPollCount((prev) => prev + 1);
        }, 2000);
      } else if (!done && pollCount >= 15) {
        // Stop polling after 30 seconds
        setError("Order processing is taking longer than expected. Please check your orders page.");
        setProcessing(false);
      }
    };

    startFetching();

    return () => {
      if (pollInterval) clearTimeout(pollInterval);
    };
  }, [fetchOrder, pollCount]);

  // Processing state
  if (processing) {
    return (
      <Column
        gap="$lg"
        alignItems="center"
        justifyContent="center"
        paddingVertical="$3xl"
        paddingHorizontal="$lg"
      >
        <Card variant="elevated" padding="$xl" maxWidth={500}>
          <Column gap="$lg" alignItems="center">
            <Spinner size="lg" color="$primary" />
            <Column gap="$sm" alignItems="center">
              <Heading level={3}>Processing Your Order</Heading>
              <Text color="$textSecondary" textAlign="center">
                Your payment was successful! We&apos;re setting up your order...
              </Text>
            </Column>
          </Column>
        </Card>
      </Column>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Column
        gap="$lg"
        alignItems="center"
        justifyContent="center"
        paddingVertical="$3xl"
        paddingHorizontal="$lg"
      >
        <Spinner size="lg" color="$primary" />
        <Text color="$textSecondary">Loading your order details...</Text>
      </Column>
    );
  }

  // Error state but payment was likely successful
  if (error || !order) {
    return (
      <Column
        gap="$lg"
        alignItems="center"
        justifyContent="center"
        paddingVertical="$3xl"
        paddingHorizontal="$lg"
      >
        <Card variant="elevated" padding="$lg" maxWidth={500}>
          <Column gap="$md" alignItems="center">
            <Column
              backgroundColor="$successLight"
              borderRadius="$full"
              padding="$lg"
              alignItems="center"
              justifyContent="center"
              width={64}
              height={64}
            >
              <Text size="$7">✓</Text>
            </Column>
            <Heading level={3}>Payment Successful!</Heading>
            <Text color="$textSecondary" textAlign="center">
              Your payment was processed successfully. You should receive an
              order confirmation email shortly.
            </Text>
            {error && (
              <Text color="$textMuted" size="$3" textAlign="center">
                {error}
              </Text>
            )}
            <Row gap="$md" marginTop="$lg">
              <Link href="/orders" style={{ textDecoration: "none" }}>
                <Button
                  size="$5"
                  backgroundColor="$primary"
                  color="$textInverse"
                >
                  View My Orders
                </Button>
              </Link>
              <Link href="/" style={{ textDecoration: "none" }}>
                <Button
                  size="$5"
                  borderWidth={1}
                  borderColor="$border"
                  backgroundColor="transparent"
                >
                  Continue Shopping
                </Button>
              </Link>
            </Row>
          </Column>
        </Card>
      </Column>
    );
  }

  return (
    <Column
      gap="$lg"
      alignItems="center"
      justifyContent="center"
      paddingVertical="$3xl"
      paddingHorizontal="$lg"
    >
      <Card variant="elevated" padding="$xl" maxWidth={600} fullWidth>
        <Column gap="$lg" alignItems="center">
          {/* Success Icon */}
          <Column
            backgroundColor="$successLight"
            borderRadius="$full"
            padding="$lg"
            alignItems="center"
            justifyContent="center"
            width={80}
            height={80}
          >
            <Text size="$9">✓</Text>
          </Column>

          {/* Success Message */}
          <Column gap="$sm" alignItems="center">
            <Heading level={2}>Order Confirmed!</Heading>
            <Text color="$textSecondary" textAlign="center">
              Thank you for your purchase. Your order has been successfully
              placed.
            </Text>
          </Column>

          {/* Product Summary */}
          <Card variant="outlined" padding="$md" fullWidth>
            <Row gap="$md" alignItems="center">
              {order.productImage && (
                <Image
                  source={{ uri: order.productImage }}
                  width={60}
                  height={60}
                  borderRadius="$md"
                  alt={order.productTitle}
                />
              )}
              <Column gap="$xs" flex={1}>
                <Text weight="semibold" numberOfLines={2}>
                  {order.productTitle}
                </Text>
                {order.productBrand && (
                  <Text size="$3" color="$textSecondary">
                    {order.productBrand}
                  </Text>
                )}
                <Text size="$3" color="$textSecondary">
                  Sold by {order.sellerName}
                </Text>
              </Column>
            </Row>
          </Card>

          {/* Order Details */}
          <Card variant="outlined" padding="$lg" fullWidth>
            <Column gap="$md">
              <Row justifyContent="space-between" alignItems="center">
                <Text color="$textSecondary">Order ID</Text>
                <Text weight="semibold" size="$3">
                  {order.id.slice(0, 8).toUpperCase()}
                </Text>
              </Row>

              <Row justifyContent="space-between" alignItems="center">
                <Text color="$textSecondary">Subtotal</Text>
                <Text weight="medium">
                  £{(order.amountTotal - order.shippingCost).toFixed(2)}
                </Text>
              </Row>

              <Row justifyContent="space-between" alignItems="center">
                <Text color="$textSecondary">Shipping</Text>
                <Text weight="medium">£{order.shippingCost.toFixed(2)}</Text>
              </Row>

              <Row
                justifyContent="space-between"
                alignItems="center"
                paddingTop="$sm"
                borderTopWidth={1}
                borderTopColor="$border"
              >
                <Text weight="semibold">Total Paid</Text>
                <Text weight="bold" size="$6" color="$primary">
                  £{order.amountTotal.toFixed(2)}
                </Text>
              </Row>

              {order.trackingCode && (
                <>
                  <Row
                    justifyContent="space-between"
                    alignItems="center"
                    paddingTop="$sm"
                    borderTopWidth={1}
                    borderTopColor="$border"
                  >
                    <Text color="$textSecondary">Tracking</Text>
                    <Text weight="semibold" size="$3">
                      {order.trackingCode}
                    </Text>
                  </Row>

                  {order.carrier && (
                    <Row justifyContent="space-between" alignItems="center">
                      <Text color="$textSecondary">Carrier</Text>
                      <Text weight="semibold">
                        {order.carrier} {order.service}
                      </Text>
                    </Row>
                  )}
                </>
              )}
            </Column>
          </Card>

          {/* Shipping Address */}
          <Card variant="outlined" padding="$lg" fullWidth>
            <Column gap="$sm">
              <Text weight="semibold">Shipping To</Text>
              <Text color="$textSecondary">
                {order.shippingAddress.name}
              </Text>
              <Text color="$textSecondary">
                {order.shippingAddress.street1}
                {order.shippingAddress.street2 && `, ${order.shippingAddress.street2}`}
              </Text>
              <Text color="$textSecondary">
                {order.shippingAddress.city}
                {order.shippingAddress.state && `, ${order.shippingAddress.state}`}{" "}
                {order.shippingAddress.zip}
              </Text>
            </Column>
          </Card>

          {/* What's Next */}
          <Column gap="$sm" paddingTop="$md" fullWidth>
            <Text weight="semibold" size="$4">
              What happens next?
            </Text>
            <Column gap="$xs" paddingLeft="$md">
              <Text color="$textSecondary" size="$3">
                • You&apos;ll receive an order confirmation email
              </Text>
              <Text color="$textSecondary" size="$3">
                • The seller will prepare your item for shipping
              </Text>
              <Text color="$textSecondary" size="$3">
                • You&apos;ll get tracking updates via email
              </Text>
              <Text color="$textSecondary" size="$3">
                • Track your order anytime in &quot;My Orders&quot;
              </Text>
            </Column>
          </Column>

          {/* Action Buttons */}
          <Row gap="$md" marginTop="$lg" fullWidth>
            <Link
              href={`/orders/${order.id}`}
              style={{ textDecoration: "none", flex: 1 }}
            >
              <Button
                size="$5"
                width="100%"
                backgroundColor="$primary"
                color="$textInverse"
              >
                View Order Details
              </Button>
            </Link>
            <Link href="/" style={{ textDecoration: "none", flex: 1 }}>
              <Button
                size="$5"
                width="100%"
                borderWidth={1}
                borderColor="$border"
                backgroundColor="transparent"
              >
                Continue Shopping
              </Button>
            </Link>
          </Row>
        </Column>
      </Card>
    </Column>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <Column
          gap="$lg"
          alignItems="center"
          justifyContent="center"
          paddingVertical="$3xl"
          paddingHorizontal="$lg"
        >
          <Spinner size="lg" color="$primary" />
          <Text color="$textSecondary">Loading order details...</Text>
        </Column>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
