"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignIn, SignUp, UserButton } from "@clerk/nextjs";
import {
  Row,
  Column,
  Text,
  AuthButton,
  GlassmorphismCard,
  getGlassmorphismStyles,
} from "@buttergolf/ui";
import { MenuIcon } from "./icons";
import { AuthModal } from "../auth/AuthModal";

// Custom icons for UserButton menu
const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width={16}
    height={16}
  >
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
  </svg>
);

const TagIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width={16}
    height={16}
  >
    <path
      fillRule="evenodd"
      d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39.92 3.31 0l4.908-4.908a2.344 2.344 0 000-3.31l-9.58-9.581a3 3 0 00-2.122-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
      clipRule="evenodd"
    />
  </svg>
);

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in");

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
            <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
              <Row alignItems="center" gap="$2" paddingVertical="$1">
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
              </Row>
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
              <SignedOut>
                <AuthButton
                  variant="login"
                  size="$4"
                  onPress={() => {
                    setAuthMode("sign-in");
                    setAuthOpen(true);
                  }}
                >
                  Log-in
                </AuthButton>
                <AuthButton
                  variant="signup"
                  size="$4"
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
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="Favourites"
                      labelIcon={<HeartIcon />}
                      href="/favourites"
                    />
                    <UserButton.Link
                      label="My Listings"
                      labelIcon={<TagIcon />}
                      href="/sell"
                    />
                    <UserButton.Action label="manageAccount" />
                    <UserButton.Action label="signOut" />
                  </UserButton.MenuItems>
                </UserButton>
              </SignedIn>
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
            <SignedOut>
              <AuthButton
                variant="login"
                size="$5"
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
                size="$5"
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
                  appearance={{
                    elements: {
                      avatarBox: "w-12 h-12",
                    },
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="Favourites"
                      labelIcon={<HeartIcon />}
                      href="/favourites"
                    />
                    <UserButton.Link
                      label="My Listings"
                      labelIcon={<TagIcon />}
                      href="/sell"
                    />
                    <UserButton.Action label="manageAccount" />
                    <UserButton.Action label="signOut" />
                  </UserButton.MenuItems>
                </UserButton>
              </Row>
            </SignedIn>
          </Column>
        </Column>
      )}

      {/* Auth Modal */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)}>
        {authMode === "sign-up" ? (
          <SignUp
            routing="hash"
            signInUrl="/sign-in"
          />
        ) : (
          <SignIn
            routing="hash"
            signUpUrl="/sign-up"
          />
        )}
      </AuthModal>
    </>
  );
}
