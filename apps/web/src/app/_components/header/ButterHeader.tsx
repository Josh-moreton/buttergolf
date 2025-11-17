"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Row, Column, Text, AuthButton } from "@buttergolf/ui";
import { MenuIcon } from "./icons";
import { SignIn, SignUp } from "@clerk/nextjs";
import { AuthModal } from "../auth/AuthModal";

// Category navigation items
const NAV_CATEGORIES = [
  { name: "Shop all", href: "/listings" },
  { name: "Drivers", href: "/category/drivers" },
  { name: "Fairway Woods", href: "/category/fairway-woods" },
  { name: "Irons", href: "/category/irons" },
  { name: "Wedges", href: "/category/wedges" },
  { name: "Putters", href: "/category/putters" },
  { name: "Hybrids", href: "/category/hybrids" },
  { name: "Shoes", href: "/category/shoes" },
  { name: "Accessories", href: "/category/accessories" },
] as const;

export function ButterHeader() {
  const pathname = usePathname();
  const [stickyMenu, setStickyMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper to check if a path is active
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(path);
  };

  // Sticky menu handler
  useEffect(() => {
    const handleStickyMenu = () => {
      setStickyMenu(window.scrollY >= 40);
    };

    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  return (
    <>
      {/* Combined Header - Main + Category Nav */}
      <Column
        {...{ style: { position: "sticky" } as React.CSSProperties }}
        top={0}
        zIndex={50}
        backgroundColor="$surface"
        {...(stickyMenu && {
          shadowColor: "$shadowColor",
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
        })}
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
            <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
              <Row alignItems="center" gap="$2" paddingVertical="$1">
                <img
                  src="/logo-orange-on-white.svg"
                  alt="ButterGolf"
                  style={{
                    height: "48px",
                    width: "auto",
                  }}
                />
              </Row>
            </Link>

            {/* Spacer to push navigation to the right */}
            <Row flex={1} display="none" $lg={{ display: "flex" }} />

            {/* Navigation - Desktop Only (Right-aligned) */}
            <Row
              display="none"
              $lg={{ display: "flex" }}
              gap="$8"
              alignItems="center"
            >
              <Link href="/" style={{ textDecoration: "none" }}>
                <Text
                  size="lg"
                  weight={isActive("/") ? "semibold" : "medium"}
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
                  size="lg"
                  weight={isActive("/listings") ? "semibold" : "medium"}
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
                  size="lg"
                  weight={isActive("/sell") ? "semibold" : "medium"}
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
              $lg={{ display: "flex" }}
              gap="$3"
              alignItems="center"
              flexShrink={0}
            >
              {mounted && (
                <>
                  <SignedOut>
                    <AuthButton
                      variant="login"
                      size="md"
                      onPress={() => {
                        setAuthMode("sign-in");
                        setAuthOpen(true);
                      }}
                    >
                      Log-in
                    </AuthButton>
                    <AuthButton
                      variant="signup"
                      size="md"
                      onPress={() => {
                        setAuthMode("sign-up");
                        setAuthOpen(true);
                      }}
                    >
                      Sign-up
                    </AuthButton>
                  </SignedOut>

                  <SignedIn>
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10",
                        },
                      }}
                    />
                  </SignedIn>
                </>
              )}
            </Row>

            {/* Mobile Menu Toggle */}
            <Row
              display="flex"
              $lg={{ display: "none" }}
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

        {/* Category Navigation Sub-header */}
        <Row
          backgroundColor="$cloudMist"
          borderBottomWidth={1}
          borderBottomColor="$border"
          paddingHorizontal="$4"
          paddingVertical="$2"
          $md={{ paddingHorizontal: "$6", paddingVertical: "$3" }}
          justifyContent="center"
        >

          <Row
            maxWidth={1440}
            width="100%"
            justifyContent="space-between"
            paddingHorizontal="$8"
            flexWrap="nowrap"
            overflow="auto"
          >
            {NAV_CATEGORIES.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                style={{ textDecoration: "none" }}
              >
                <Text
                  size="sm"
                  weight="normal"
                  color="$text"
                  cursor="pointer"
                  hoverStyle={{
                    fontWeight: "600",
                  }}
                  whiteSpace="nowrap"
                >
                  {category.name}
                </Text>
              </Link>
            ))}
          </Row>
        </Row>
      </Column>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <Column
          {...{ style: { position: "fixed" } as React.CSSProperties }}
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
              size="xl"
              weight={isActive("/") ? "bold" : "semibold"}
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
              size="xl"
              weight={isActive("/listings") ? "bold" : "semibold"}
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
              size="xl"
              weight={isActive("/sell") ? "bold" : "semibold"}
              color={isActive("/sell") ? "$primary" : "$text"}
            >
              Selling
            </Text>
          </Link>

          {/* Mobile Auth Buttons */}
          <Column gap="$3" marginTop="$6">
            {mounted && (
              <>
                <SignedOut>
                  <AuthButton
                    variant="login"
                    size="lg"
                    fullWidth
                    onPress={() => {
                      setAuthMode("sign-in");
                      setAuthOpen(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Log-in
                  </AuthButton>
                  <AuthButton
                    variant="signup"
                    size="lg"
                    fullWidth
                    onPress={() => {
                      setAuthMode("sign-up");
                      setAuthOpen(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign-up
                  </AuthButton>
                </SignedOut>

                <SignedIn>
                  <Row justifyContent="center" paddingVertical="$4">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-12 h-12",
                        },
                      }}
                    />
                  </Row>
                </SignedIn>
              </>
            )}
          </Column>
        </Column>
      )}

      {/* Auth Modal */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)}>
        {authMode === "sign-up" ? (
          <SignUp routing="hash" signInUrl="/sign-in" />
        ) : (
          <SignIn routing="hash" signUpUrl="/sign-up" />
        )}
      </AuthModal>
    </>
  );
}
