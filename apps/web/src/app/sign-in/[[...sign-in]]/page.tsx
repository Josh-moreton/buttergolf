"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 24,
        paddingTop: 160, // clear the sticky header (~140px) + spacing
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
}
