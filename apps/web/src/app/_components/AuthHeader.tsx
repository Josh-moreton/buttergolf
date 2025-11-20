"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Row, Column, Separator, Text, Button } from "@buttergolf/ui";
import Link from "next/link";

export default function AuthHeader() {
  return (
    <Column
      width="100%"
      padding="$3"
      borderBottomWidth={1}
      borderColor="$border"
      backgroundColor="$background"
    >
      <Row alignItems="center" justifyContent="space-between">
        <Link href="/">
          <Text size="$5" fontWeight="700">
            ButterGolf
          </Text>
        </Link>
        <Row alignItems="center" gap="$sm">
          <Link href="/rounds">
            <Button size="$4">Rounds</Button>
          </Link>
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="$3">Sign in</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Row>
      </Row>
      <Separator marginTop="$3" />
    </Column>
  );
}
