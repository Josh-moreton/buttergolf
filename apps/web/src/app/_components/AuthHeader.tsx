"use client"

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { XStack, YStack, Separator, Text, Button } from "@buttergolf/ui"
import Link from "next/link"

export default function AuthHeader() {
  return (
    <YStack width="100%" padding="$3" borderBottomWidth={1} borderColor="$borderColor" backgroundColor="$background">
      <XStack alignItems="center" justifyContent="space-between">
        <Link href="/">
          <Text fontSize="$5" fontWeight="700">ButterGolf</Text>
        </Link>
        <XStack alignItems="center" gap="$3">
          <Link href="/rounds">
            <Button size="$3" variant="outlined">Rounds</Button>
          </Link>
          <SignedOut>
            <SignInButton>
              <Button size="$3">Sign in</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </XStack>
      </XStack>
      <Separator marginTop="$3" />
    </YStack>
  )
}
