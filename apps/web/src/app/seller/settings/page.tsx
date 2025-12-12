"use client";

import { ConnectAccountManagement } from "@stripe/react-connect-js";
import { Column, Heading, Text } from "@buttergolf/ui";

/**
 * Seller Settings Page
 *
 * Displays the Stripe ConnectAccountManagement component which allows:
 * - Updating business information
 * - Managing bank accounts for payouts
 * - Viewing verification status
 * - Updating account representatives
 *
 * This is a REQUIRED component for Fully Embedded Connect integrations
 * to allow connected accounts to manage their settings without
 * access to the Stripe Dashboard.
 */
export default function SellerSettingsPage() {
  return (
    <Column gap="$lg" fullWidth>
      <Column gap="$xs">
        <Heading level={2}>Account Settings</Heading>
        <Text color="$textSecondary">
          Manage your business information, bank accounts, and verification status
        </Text>
      </Column>

      <ConnectAccountManagement />
    </Column>
  );
}
