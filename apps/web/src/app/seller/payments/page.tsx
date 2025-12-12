"use client";

import { ConnectPayments } from "@stripe/react-connect-js";
import { Column, Heading, Text } from "@buttergolf/ui";

/**
 * Seller Payments Page
 *
 * Displays the Stripe ConnectPayments component which shows:
 * - Transaction history
 * - Payment details
 * - Dispute management
 * - Refund management
 *
 * This is a required component for Fully Embedded Connect integrations
 * to handle disputes and refunds.
 */
export default function SellerPaymentsPage() {
  return (
    <Column gap="$lg" fullWidth>
      <Column gap="$xs">
        <Heading level={2}>Payments</Heading>
        <Text color="$textSecondary">
          View your transaction history, manage refunds, and handle disputes
        </Text>
      </Column>

      <ConnectPayments />
    </Column>
  );
}
