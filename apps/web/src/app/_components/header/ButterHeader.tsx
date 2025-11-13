"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Row, Column, Text, AuthButton, AuthModal } from "@buttergolf/ui";
import { MenuIcon } from "./icons";
import { SignIn, SignUp } from "@clerk/nextjs";

export function ButterHeader() {
  const [stickyMenu, setStickyMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in");

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
      <Row
        {...{ style: { position: "fixed" } }}
        top={0}
        left={0}
        right={0}
        zIndex={50}
        backgroundColor="$surface"
        borderBottomWidth={1}
        borderBottomColor="$border"
        paddingHorizontal="$4"
        paddingVertical="$3"
        $md={{ paddingHorizontal: "$6", paddingVertical: "$4" }}
        {...(stickyMenu && {
          shadowColor: "$shadowColor",
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
        })}
        suppressHydrationWarning
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

          {/* Center Navigation - Desktop Only */}
          <Row
            display="none"
            $lg={{ display: "flex" }}
            gap="$8"
            alignItems="center"
            justifyContent="center"
            flex={1}
          >
            <Link href="/" style={{ textDecoration: "none" }}>
              <Text
                size="md"
                weight="medium"
                color="$text"
                cursor="pointer"
                hoverStyle={{
                  color: "$primary",
                }}
              >
                Home
              </Text>
            </Link>
            <Link href="/buying" style={{ textDecoration: "none" }}>
              <Text
                size="md"
                weight="medium"
                color="$text"
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
                size="md"
                weight="medium"
                color="$text"
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
            {...{ style: { background: "none", border: "none" } }}
            aria-label="Menu"
            color="$text"
          >
            <MenuIcon />
          </Row>
        </Row>
      </Row>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <Column
          {...{ style: { position: "fixed" } }}
          top={65} // Below header
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
            <Text size="xl" weight="semibold" color="$text">
              Home
            </Text>
          </Link>
          <Link
            href="/buying"
            style={{ textDecoration: "none" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Text size="xl" weight="semibold" color="$text">
              Buying
            </Text>
          </Link>
          <Link
            href="/sell"
            style={{ textDecoration: "none" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Text size="xl" weight="semibold" color="$text">
              Selling
            </Text>
          </Link>

          {/* Mobile Auth Buttons */}
          <Column gap="$3" marginTop="$6">
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
