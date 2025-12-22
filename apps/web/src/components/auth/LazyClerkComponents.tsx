"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import type { UserButtonWithMenuProps } from "./UserButtonWithMenu";

/**
 * Lazy-loaded Clerk components to reduce initial JavaScript bundle size.
 * These are dynamically imported to avoid loading ~300KB of Clerk JS on initial page load.
 * 
 * Lighthouse identified Clerk bundles as major contributors to unused JavaScript:
 * - clerk.browser.js: 56KB wasted
 * - ui-common_clerk.browser: 84KB wasted  
 * - vendors_clerk.browser: 44KB wasted
 * 
 * By lazy-loading, we defer this cost until the user actually needs auth UI.
 */

// Lazy-load SignedIn component
export const LazySignedIn = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignedIn),
  { ssr: true }
);

// Lazy-load SignedOut component
export const LazySignedOut = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignedOut),
  { ssr: true }
);

// Placeholder for UserButton while loading
function UserButtonPlaceholder() {
  return (
    <div 
      style={{ 
        width: 40, 
        height: 40, 
        borderRadius: "50%", 
        backgroundColor: "#e5e5e5",
      }} 
      aria-label="Loading user menu"
    />
  );
}

// Lazy-loaded UserButton wrapper that includes the full menu
// We need to import the full component since UserButton uses compound components
const LazyUserButtonInternal = dynamic<UserButtonWithMenuProps>(
  () => import("./UserButtonWithMenu"),
  { 
    ssr: false, // UserButton requires client-side rendering
    loading: () => <UserButtonPlaceholder />
  }
);

export function LazyUserButton({ size = "default" }: UserButtonWithMenuProps) {
  return (
    <Suspense fallback={<UserButtonPlaceholder />}>
      <LazyUserButtonInternal size={size} />
    </Suspense>
  );
}
