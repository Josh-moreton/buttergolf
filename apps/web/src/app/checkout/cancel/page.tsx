"use client";

import { Column, Text, Heading, Button, Card, Row } from "@buttergolf/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutCancelPage() {
  const router = useRouter();

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
          {/* Cancel Icon */}
          <Column
            backgroundColor="$warningLight"
            borderRadius="$full"
            padding="$lg"
            alignItems="center"
            justifyContent="center"
            width={80}
            height={80}
          >
            <Text fontSize={40}>⚠️</Text>
          </Column>

          {/* Cancel Message */}
          <Column gap="$sm" alignItems="center">
            <Heading level={2}>Checkout Cancelled</Heading>
            <Text color="$textSecondary" align="center">
              Your payment was cancelled. No charges were made to your account.
            </Text>
          </Column>

          {/* Information */}
          <Card variant="outlined" padding="$lg" fullWidth>
            <Column gap="$md">
              <Text weight="semibold">Why was my checkout cancelled?</Text>
              <Column gap="$xs" paddingLeft="$md">
                <Text color="$textSecondary" size="$3">
                  • You clicked the back button
                </Text>
                <Text color="$textSecondary" size="$3">
                  • The checkout session timed out
                </Text>
                <Text color="$textSecondary" size="$3">
                  • You closed the checkout window
                </Text>
              </Column>
            </Column>
          </Card>

          {/* What's Next */}
          <Column gap="$sm">
            <Text weight="semibold" fontSize="$4">
              What's Next?
            </Text>
            <Column gap="$xs">
              <Text color="$textSecondary" fontSize="$3">
                • Review your order details
              </Text>
              <Text color="$textSecondary" fontSize="$3">
                • Update shipping or payment information
              </Text>
              <Text color="$textSecondary" fontSize="$3">

          {/* Action Buttons */}
          <Row gap="$md" marginTop="$lg" fullWidth>
            <Button
              size="$5"
              onPress={() => router.back()}
              flex={1}
              backgroundColor="$primary"
              color="$textInverse"
            >
              Try Again
            </Button>
            <Link href="/" style={{ textDecoration: "none", flex: 1 }}>
              <Button size="$5" width="100%" borderWidth={1} borderColor="$border" backgroundColor="transparent">
                Browse Products
              </Button>
            </Link>
          </Row>
        </Column>
      </Card>
    </Column>
  );
}
