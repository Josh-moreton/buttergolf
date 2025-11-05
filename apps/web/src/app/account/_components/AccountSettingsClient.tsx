"use client";

import { useState } from "react";
import {
  Column,
  Row,
  Heading,
  Text,
  Button,
  Card,
  Badge,
} from "@buttergolf/ui";
import { SellerOnboarding } from "../../_components/SellerOnboarding";

interface AccountSettingsClientProps {
  readonly hasConnectAccount: boolean;
  readonly onboardingComplete: boolean;
  readonly accountStatus: string;
}

/**
 * Client component for account settings page
 * Handles seller onboarding state and UI interactions
 */
export function AccountSettingsClient({
  hasConnectAccount,
  onboardingComplete,
  accountStatus,
}: AccountSettingsClientProps) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Determine badge variant based on account status
  const getStatusBadge = () => {
    switch (accountStatus) {
      case "active":
        return (
          <Badge variant="success" {...{ size: "md" as any }}>
            Active Seller
          </Badge>
        );
      case "restricted":
        return (
          <Badge variant="warning" {...{ size: "md" as any }}>
            Restricted
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="info" {...{ size: "md" as any }}>
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Refresh the page to show updated status
    globalThis.location.reload();
  };

  const renderContent = () => {
    if (hasConnectAccount && onboardingComplete && accountStatus === "active") {
      return (
        <>
          <Text {...{ color: "secondary" as any }}>
            Your seller account is active and ready to receive payments. You can
            now list products and manage your sales.
          </Text>
          <Row gap="$md">
            <Button {...{ size: "md" as any, tone: "outline" as any }} onPress={() => { /* View dashboard */ }}>
              View Dashboard
            </Button>
            <Button
              {...{ size: "md" as any, tone: "ghost" as any }}
              onPress={() => setShowOnboarding(true)}
            >
              Update Account
            </Button>
          </Row>
        </>
      );
    }

    if (hasConnectAccount && onboardingComplete && accountStatus === "restricted") {
      return (
        <>
          <Text {...{ color: "secondary" as any }}>
            Your seller account has some restrictions. Please update your
            account information to enable full functionality.
          </Text>
          <Row>
            <Button
              {...{ size: "md" as any, tone: "warning" as any }}
              onPress={() => setShowOnboarding(true)}
            >
              Resolve Issues
            </Button>
          </Row>
        </>
      );
    }

    if (hasConnectAccount && onboardingComplete) {
      return (
        <>
          <Text {...{ color: "secondary" as any }}>
            Your seller account is being reviewed. This usually takes 1-2
            business days.
          </Text>
          <Row>
            <Button
              {...{ size: "md" as any, tone: "outline" as any }}
              onPress={() => setShowOnboarding(true)}
            >
              View Status
            </Button>
          </Row>
        </>
      );
    }

    if (hasConnectAccount) {
      return (
        <>
          <Text {...{ color: "secondary" as any }}>
            Your seller account setup is incomplete. Please complete the
            onboarding process to start selling.
          </Text>
          <Row gap="$md">
            <Button
              {...{ size: "md" as any, tone: "primary" as any }}
              onPress={() => setShowOnboarding(true)}
            >
              Continue Onboarding
            </Button>
          </Row>
        </>
      );
    }

    return (
      <>
        <Text {...{ color: "secondary" as any }}>
          Start selling golf equipment on ButterGolf. Complete the quick
          onboarding process to set up your seller account and begin listing
          products.
        </Text>
        <Row>
          <Button
            {...{ size: "lg" as any, tone: "primary" as any }}
            onPress={() => setShowOnboarding(true)}
          >
            Become a Seller
          </Button>
        </Row>
      </>
    );
  };

  if (showOnboarding) {
    return (
      <Card variant="elevated" {...{ padding: "lg" as any }}>
        <SellerOnboarding
          onComplete={handleOnboardingComplete}
          onExit={() => setShowOnboarding(false)}
        />
      </Card>
    );
  }

  return (
    <Card variant="elevated" {...{ padding: "lg" as any }}>
      <Column gap="$lg">
        <Row align="center" {...{ justify: "space-between" as any }}>
          <Heading level={3}>Seller Account</Heading>
          {getStatusBadge()}
        </Row>
        {renderContent()}
      </Column>
    </Card>
  );
}
