"use client"

import { useEffect } from "react"
import { SignIn, SignUp } from "@clerk/nextjs"
import { Column } from "@buttergolf/ui"

type AuthMode = "sign-in" | "sign-up"

export function SignInModal({
  open,
  onClose,
  mode = "sign-in",
}: Readonly<{ open: boolean; onClose: () => void; mode?: AuthMode }>) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <Column
      {...{ style: { position: "fixed", inset: 0 as any, backdropFilter: "blur(6px)" } }}
      backgroundColor="rgba(0,0,0,0.35)"
      zIndex={100}
      alignItems="center"
      justifyContent="center"
      onPress={onClose}
    >
      {/* Content wrapper only to stop propagation - no extra chrome */}
      <Column onPress={(e) => e.stopPropagation()}>
        {mode === "sign-up" ? (
          <SignUp routing="hash" signInUrl="/sign-in" />
        ) : (
          <SignIn routing="hash" signUpUrl="/sign-up" />
        )}
      </Column>
    </Column>
  )
}
