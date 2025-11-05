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
  Container,
} from "@buttergolf/ui";
import { SellerOnboarding } from "../../_components/SellerOnboarding";

interface AccountSettingsClientProps {
  readonly user: {
    readonly email: string;
    readonly name?: string;
    readonly hasConnectAccount: boolean;
    readonly onboardingComplete: boolean;
    readonly accountStatus: string;
  };
}

/**
 * Client component for account settings page
 * Handles seller onboarding state and UI interactions
 */
export function AccountSettingsClient({ user }: AccountSettingsClientProps) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Determine badge variant based on account status
  const getStatusBadge = () => {
    switch (user.accountStatus) {
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
    if (user.hasConnectAccount && user.onboardingComplete && user.accountStatus === "active") {
      return (
        <>
          <Text {...{ color: "secondary" as any }}>
            Your seller account is active and ready to receive payments. You can
            now list products and manage your sales.
          </Text>
          <Row gap="$md">
            <Button
              {...{ size: "md" as any, tone: "outline" as any }}
              onPress={() => {
                /* View dashboard */
              }}
            >
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

    if (
      user.hasConnectAccount &&
      user.onboardingComplete &&
      user.accountStatus === "restricted"
    ) {
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

    if (user.hasConnectAccount && user.onboardingComplete) {
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

    if (user.hasConnectAccount) {
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
      <Container {...{ size: "lg" as any, padding: "md" as any }}>
        <Card variant="elevated" {...{ padding: "lg" as any }}>
          <SellerOnboarding
            onComplete={handleOnboardingComplete}
            onExit={() => setShowOnboarding(false)}
          />
        </Card>
      </Container>
    );
  }

  return (
    <Container {...{ size: "lg" as any, padding: "md" as any }}>
      <Column gap="$xl" fullWidth>
        <Column gap="$sm">
          <Heading level={1}>Account Settings</Heading>
          <Text {...{ color: "secondary" as any }}>
            Manage your account and seller settings
          </Text>
        </Column>

        {/* Account Info Card */}
        <Card variant="elevated" {...{ padding: "lg" as any }}>
          <Column gap="$md">
            <Heading level={3}>Account Information</Heading>
            <Column gap="$xs">
              <Text weight="medium">Email</Text>
              <Text {...{ color: "secondary" as any }}>{user.email}</Text>
            </Column>
            {user.name && (
              <Column gap="$xs">
                <Text weight="medium">Name</Text>
                <Text {...{ color: "secondary" as any }}>{user.name}</Text>
              </Column>
            )}
          </Column>
        </Card>

        {/* Seller Status Card */}
        <Card variant="elevated" {...{ padding: "lg" as any }}>
          <Column gap="$lg">
            <Row align="center" {...{ justify: "space-between" as any }}>
              <Heading level={3}>Seller Account</Heading>
              {getStatusBadge()}
            </Row>
            {renderContent()}
          </Column>
        </Card>
      </Column>
    </Container>
  );
}
