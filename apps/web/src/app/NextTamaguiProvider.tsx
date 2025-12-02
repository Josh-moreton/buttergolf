"use client";

import { NextTamaguiProvider as BaseProvider } from "@buttergolf/app/src/provider/NextTamaguiProvider";
import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";

export function NextTamaguiProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <BaseProvider>{children}</BaseProvider>
    </ClerkProvider>
  );
}
