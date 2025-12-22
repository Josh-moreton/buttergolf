"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LazySignedIn, LazySignedOut, LazyUserButton } from "@/components/auth/LazyClerkComponents";
import { MessageSquare } from "lucide-react";
import {
  Row,
  Column,
  Text,
  AuthButton,
  GlassmorphismCard,
  getGlassmorphismStyles,
} from "@buttergolf/ui";
import { MenuIcon } from "./icons";

// Category navigation items
const NAV_CATEGORIES = [
  { name: "Shop all", href: "/listings" },
  { name: "Drivers", href: "/category/drivers" },
  { name: "Irons", href: "/category/irons" },
  { name: "Wedges", href: "/category/wedges" },
  { name: "Putters", href: "/category/putters" },
  { name: "Bags", href: "/category/bags" },
  { name: "Balls", href: "/category/balls" },
  { name: "Apparel", href: "/category/apparel" },
  { name: "Accessories", href: "/category/accessories" },
  { name: "GPS & Tech", href: "/category/gps-tech" },
];

export function ButterHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper to check if a path is active
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(path);
  };

  return (
    <>
      {/* Combined Header - Main + Category Nav */}
      <Column
        width="100%"
        style={{ position: "sticky" } as React.CSSProperties}
        top={0}
        zIndex={999}
        suppressHydrationWarning
      >
        {/* Main Header Row */}
        <Row
          backgroundColor="$surface"
          borderBottomWidth={1}
          borderBottomColor="$border"
          paddingHorizontal="$4"
          paddingVertical="$3"
          $md={{ paddingHorizontal: "$6", paddingVertical: "$4" }}
        >
          <Row
            width="100%"
            maxWidth={1440}
            marginHorizontal="auto"
            justifyContent="space-between"
            alignItems="center"
            gap="$4"
            $md={{ gap: "$6" }}
          >
            {/* Logo */}
            <Link href="/">
              <div style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0, cursor: "pointer" }}>
                <Image
                  src="/logo-orange-on-white.svg"
                  alt="ButterGolf"
                  width={192}
                  height={48}
                  priority
                  style={{
                    height: "48px",
                    width: "auto",
                  }}
                />
              </div>
            </Link>

            {/* Spacer to push navigation to the right */}
            <Row flex={1} display="none" $gtMd={{ display: "flex" }} />

            {/* Navigation - Desktop Only (Right-aligned) */}
            <Row
              display="none"
              $gtMd={{ display: "flex" }}
              gap="$8"
              alignItems="center"
            >
              <Link href="/" style={{ textDecoration: "none" }}>
                <Text
                  size="$6"
                  weight={isActive("/") ? "bold" : "normal"}
                  color={isActive("/") ? "$primary" : "$text"}
                  cursor="pointer"
                  hoverStyle={{
                    color: "$primary",
                  }}
                >
                  Home
                </Text>
              </Link>
              <Link href="/listings" style={{ textDecoration: "none" }}>
                <Text
                  size="$6"
                  weight={isActive("/listings") ? "bold" : "normal"}
                  color={isActive("/listings") ? "$primary" : "$text"}
                  cursor="pointer"
                  hoverStyle={{
                    color: "$primary",
                  }}
                >
                  Buying
                </Text>
              </Link>
              <Link href="/sell" style={{ textDecoration: "none" }}>
                <Text
                  size="$6"
                  weight={isActive("/sell") ? "bold" : "normal"}
                  color={isActive("/sell") ? "$primary" : "$text"}
                  cursor="pointer"
                  hoverStyle={{
                    color: "$primary",
                  }}
                >
                  Selling
                </Text>
              </Link>
            </Row>

            {/* Right Side: Auth Buttons - Desktop Only */}
            <Row
              display="none"
              $gtMd={{ display: "flex" }}
              gap="$3"
              alignItems="center"
              flexShrink={0}
            >
              <LazySignedOut>
                <AuthButton
                  variant="login"
                  size="$4"
                  onPress={() => router.push('/sign-in')}
                >
                  Log-in
                </AuthButton>
                <AuthButton
                  variant="signup"
                  size="$4"
                  onPress={() => router.push('/sign-up')}
                >
                  Sign-up
                </AuthButton>
              </LazySignedOut>

              <LazySignedIn>
                <Link
                  href="/messages"
                  style={{ textDecoration: "none" }}
                  aria-label="Messages"
                  title="Messages"
                >
                  <Row
                    alignItems="center"
                    justifyContent="center"
                    padding="$2"
                    minWidth={44}
                    minHeight={44}
                    borderRadius="$full"
                    color={isActive("/messages") ? "$primary" : "$text"}
                    hoverStyle={{
                      backgroundColor: "$backgroundHover",
                    }}
                  >
                    <MessageSquare size={20} color="currentColor" />
                  </Row>
                </Link>

                <LazyUserButton size="default" />
              </LazySignedIn>
            </Row>

            {/* Mobile Menu Toggle */}
            <Row
              display="flex"
              $gtMd={{ display: "none" }}
              tag="button"
              cursor="pointer"
              hoverStyle={{ opacity: 0.8 }}
              padding="$2"
              minWidth={44}
              minHeight={44}
              alignItems="center"
              justifyContent="center"
              onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
              backgroundColor="transparent"
              borderWidth={0}
              aria-label="Menu"
              color="$text"
            >
              <MenuIcon />
            </Row>
          </Row>
        </Row>

        {/* Category Navigation Sub-header - iOS Liquid Glass Effect */}
        <Row
          paddingHorizontal="$4"
          paddingVertical="$3"
          $md={{ paddingHorizontal: "$6", paddingVertical: "$4" }}
          justifyContent="center"
          backgroundColor="transparent"
        >
          <GlassmorphismCard
            intensity="medium"
            blur="medium"
            maxWidth={1280}
            width="100%"
            paddingHorizontal="$6"
            paddingVertical="$3"
            justifyContent="space-between"
            flexWrap="nowrap"
            style={{
              overflow: "auto",
              display: "flex",
              flexDirection: "row",
              ...getGlassmorphismStyles("medium"),
            }}
          >
            {NAV_CATEGORIES.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                style={{ textDecoration: "none" }}
              >
                <Text
                  size="$3"
                  weight="normal"
                  color="$text"
                  cursor="pointer"
                  hoverStyle={{
                    fontWeight: "600",
                  }}
                >
                  {category.name}
                </Text>
              </Link>
            ))}
          </GlassmorphismCard>
        </Row>
      </Column>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <Column
          style={{ position: "fixed" }}
          top={110}
          left={0}
          right={0}
          bottom={0}
          backgroundColor="$surface"
          zIndex={45}
          paddingHorizontal="$6"
          paddingVertical="$8"
          gap="$6"
          shadowColor="$shadowColor"
          shadowRadius={8}
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.15}
        >
          <Link
            href="/"
            style={{ textDecoration: "none" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Text
              size="$7"
              weight={isActive("/") ? "bold" : "normal"}
              color={isActive("/") ? "$primary" : "$text"}
            >
              Home
            </Text>
          </Link>
          <Link
            href="/listings"
            style={{ textDecoration: "none" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Text
              size="$7"
              weight={isActive("/listings") ? "bold" : "normal"}
              color={isActive("/listings") ? "$primary" : "$text"}
            >
              Buying
            </Text>
          </Link>
          <Link
            href="/sell"
            style={{ textDecoration: "none" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Text
              size="$7"
              weight={isActive("/sell") ? "bold" : "normal"}
              color={isActive("/sell") ? "$primary" : "$text"}
            >
              Selling
            </Text>
          </Link>

          {/* Mobile Auth Buttons */}
          <Column gap="$3" marginTop="$6">
            <LazySignedOut>
              <AuthButton
                variant="login"
                size="$5"
                fullWidth
                onPress={() => {
                  router.push('/sign-in');
                  setMobileMenuOpen(false);
                }}
              >
                Log-in
              </AuthButton>
              <AuthButton
                variant="signup"
                size="$5"
                fullWidth
                onPress={() => {
                  router.push('/sign-up');
                  setMobileMenuOpen(false);
                }}
              >
                Sign-up
              </AuthButton>
            </LazySignedOut>

            <LazySignedIn>
              <Row justifyContent="center" paddingVertical="$4">
                <LazyUserButton size="large" />
              </Row>
            </LazySignedIn>
          </Column>
        </Column>
      )}
    </>
  );
}
