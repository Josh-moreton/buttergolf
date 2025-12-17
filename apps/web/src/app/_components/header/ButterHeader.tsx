"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  Row,
  Column,
  Text,
  AuthButton,
  GlassmorphismCard,
  getGlassmorphismStyles,
} from "@buttergolf/ui";
import { MenuIcon } from "./icons";

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

const StoreIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width={16}
    height={16}
  >
    <path d="M5.223 2.25c-.497 0-.974.198-1.325.55l-1.3 1.298A3.75 3.75 0 007.5 9.75c.627.47 1.406.75 2.25.75.844 0 1.624-.28 2.25-.75.626.47 1.406.75 2.25.75.844 0 1.623-.28 2.25-.75a3.75 3.75 0 004.902-5.652l-1.3-1.299a1.875 1.875 0 00-1.325-.549H5.223z" />
    <path fillRule="evenodd" d="M3 20.25v-8.755c1.42.674 3.08.673 4.5 0A5.234 5.234 0 009.75 12c.804 0 1.568-.182 2.25-.506a5.234 5.234 0 002.25.506c.804 0 1.567-.182 2.25-.506 1.42.674 3.08.675 4.5.001v8.755h.75a.75.75 0 010 1.5H2.25a.75.75 0 010-1.5H3zm3-6a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75v-3zm8.25-.75a.75.75 0 00-.75.75v5.25c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-5.25a.75.75 0 00-.75-.75h-3z" clipRule="evenodd" />
  </svg>
);

const OrdersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width={16}
    height={16}
  >
    <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
    <path
      fillRule="evenodd"
      d="m3.087 9 .54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.163 3.75A.75.75 0 0110 12h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75z"
      clipRule="evenodd"
    />
  </svg>
);

const MessageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width={16}
    height={16}
  >
    <path
      fillRule="evenodd"
      d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z"
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

              <SignedIn>
                <Link href="/messages" style={{ textDecoration: "none" }}>
                  <Text
                    size="$6"
                    weight={isActive("/messages") ? "bold" : "normal"}
                    color={isActive("/messages") ? "$primary" : "$text"}
                    cursor="pointer"
                    hoverStyle={{
                      color: "$primary",
                    }}
                  >
                    Messages
                  </Text>
                </Link>
              </SignedIn>
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
                      label="My Orders"
                      labelIcon={<OrdersIcon />}
                      href="/orders"
                    />
                    <UserButton.Link
                      label="Messages"
                      labelIcon={<MessageIcon />}
                      href="/messages"
                    />
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
                    <UserButton.Link
                      label="Become a Seller"
                      labelIcon={<StoreIcon />}
                      href="/account"
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
                      label="My Orders"
                      labelIcon={<OrdersIcon />}
                      href="/orders"
                    />
                    <UserButton.Link
                      label="Messages"
                      labelIcon={<MessageIcon />}
                      href="/messages"
                    />
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
                    <UserButton.Link
                      label="Become a Seller"
                      labelIcon={<StoreIcon />}
                      href="/account"
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
    </>
  );
}
