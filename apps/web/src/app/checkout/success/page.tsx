"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Column, Text, Heading, Button, Card, Spinner, Row } from "@buttergolf/ui";
import Link from "next/link";

interface OrderDetails {
  id: string;
  productTitle: string;
  amountTotal: number;
  trackingCode: string | null;
  carrier: string | null;
  status: string;
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentIntentId = searchParams.get("payment_intent");

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentIntentId) {
      setError("No payment intent ID provided");
      setLoading(false);
      return;
    }

    // Fetch order details
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/by-payment-intent/${paymentIntentId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Unable to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [paymentIntentId]);

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
            <Heading level={3}>Payment Successful!</Heading>
            <Text color="$textSecondary" align="center">
              Your payment was processed successfully. You should receive an order
              confirmation email shortly.
            </Text>
            <Row gap="$md" marginTop="$lg">
              <Link href="/orders" style={{ textDecoration: "none" }}>
                <Button size="$5" backgroundColor="$primary" color="$textInverse">
                  View My Orders
                </Button>
              </Link>
              <Link href="/" style={{ textDecoration: "none" }}>
                <Button size="$5" borderWidth={1} borderColor="$border" backgroundColor="transparent">
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
            <Text fontSize={40}>✓</Text>
          </Column>

          {/* Success Message */}
          <Column gap="$sm" alignItems="center">
            <Heading level={2}>Order Confirmed!</Heading>
            <Text color="$textSecondary" align="center">
              Thank you for your purchase. Your order has been successfully placed.
            </Text>
          </Column>

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
                <Text color="$textSecondary">Product</Text>
                <Text weight="semibold">{order.productTitle}</Text>
              </Row>

              <Row justifyContent="space-between" alignItems="center">
                <Text color="$textSecondary">Total Paid</Text>
                <Text weight="bold" size="$6" color="$primary">
                  ${order.amountTotal.toFixed(2)}
                </Text>
              </Row>

              {order.trackingCode && (
                <>
                  <Row justifyContent="space-between" alignItems="center">
                    <Text color="$textSecondary">Tracking</Text>
                    <Text weight="semibold" size="$3">
                      {order.trackingCode}
                    </Text>
                  </Row>

                  {order.carrier && (
                    <Row justifyContent="space-between" alignItems="center">
                      <Text color="$textSecondary">Carrier</Text>
                      <Text weight="semibold">{order.carrier}</Text>
                    </Row>
                  )}
                </>
              )}
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
              <Button size="$5" width="100%" backgroundColor="$primary" color="$textInverse">
                View Order Details
              </Button>
            </Link>
            <Link href="/" style={{ textDecoration: "none", flex: 1 }}>
              <Button size="$5" width="100%" borderWidth={1} borderColor="$border" backgroundColor="transparent">
                Continue Shopping
              </Button>
            </Link>
          </Row>
        </Column>
      </Card>
    </Column>
  );
}
