"use client"

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { Row, Column, Separator, Text, Button } from "@buttergolf/ui"
import Link from "next/link"

export default function AuthHeader() {
  return (
    <Column width="100%" padding="$3" borderBottomWidth={1} borderColor="$border" backgroundColor="$background">
      <Row align="center" {...{ justify: "between" as any }}>
        <Link href="/">
          <Text fontSize="$5" fontWeight="700">ButterGolf</Text>
        </Link>
        <Row align="center" {...{ gap: "sm" as any }}>
          <Link href="/rounds">
            <Button size="md" tone="outline">Rounds</Button>
          </Link>
          <SignedOut>
            <SignInButton>
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
  )
}
