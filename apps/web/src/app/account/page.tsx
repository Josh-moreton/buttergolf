import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@buttergolf/db";
import { Container, Column, Heading, Text, Card } from "@buttergolf/ui";
import { AccountSettingsClient } from "./_components/AccountSettingsClient";

export const dynamic = "force-dynamic";

/**
 * Account Settings Page
 *
 * Displays user account information and seller onboarding status.
 * Protected route - requires authentication.
 */
export default async function AccountPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch user data including Connect account status
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      email: true,
      name: true,
      stripeConnectId: true,
      stripeOnboardingComplete: true,
      stripeAccountStatus: true,
    },
  });

  if (!user) {
    redirect("/sign-in");
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

        {/* Seller Status - Client Component */}
        <AccountSettingsClient
          hasConnectAccount={!!user.stripeConnectId}
          onboardingComplete={user.stripeOnboardingComplete || false}
          accountStatus={user.stripeAccountStatus || "none"}
        />
      </Column>
    </Container>
  );
}
