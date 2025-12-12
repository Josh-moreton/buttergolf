"use client";

import { ConnectDocuments } from "@stripe/react-connect-js";
import { Column, Heading, Text } from "@buttergolf/ui";

/**
 * Seller Documents Page
 *
 * Displays the Stripe ConnectDocuments component which shows:
 * - Tax invoices
 * - 1099 tax forms (for US sellers)
 * - Other compliance documents
 *
 * This is a REQUIRED component for Fully Embedded Connect integrations
 * when Stripe owns pricing (fees_collector: "stripe"). Stripe notifies
 * connected accounts by email when their tax documents are ready.
 */
export default function SellerDocumentsPage() {
  return (
    <Column gap="$lg" fullWidth>
      <Column gap="$xs">
        <Heading level={2}>Documents</Heading>
        <Text color="$textSecondary">
          Access your tax documents, invoices, and compliance paperwork
        </Text>
      </Column>

      <ConnectDocuments />
    </Column>
  );
}
