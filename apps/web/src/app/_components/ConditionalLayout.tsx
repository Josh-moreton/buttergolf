"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface ConditionalLayoutProps {
  children: ReactNode;
  /** Routes where children should be hidden */
  excludeRoutes?: string[];
}

/**
 * Conditionally renders children based on the current route.
 * Use this to hide layout elements (header, footer, banners) on specific routes.
 *
 * @example
 * <ConditionalLayout excludeRoutes={['/coming-soon']}>
 *   <Header />
 * </ConditionalLayout>
 */
export function ConditionalLayout({
  children,
  excludeRoutes = [],
}: Readonly<ConditionalLayoutProps>) {
  const pathname = usePathname();

  // Check if current route matches any excluded route
  // Supports exact matches and prefix matches (ending with *)
  const shouldHide = excludeRoutes.some((route) => {
    if (route.endsWith("*")) {
      // Prefix match: '/admin/*' matches '/admin/users', '/admin/settings', etc.
      return pathname?.startsWith(route.slice(0, -1));
    }
    // Exact match
    return pathname === route;
  });

  if (shouldHide) return null;

  return <>{children}</>;
}
