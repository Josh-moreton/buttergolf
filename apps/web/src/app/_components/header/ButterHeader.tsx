"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Row, Column, Text } from "@buttergolf/ui";
import { SearchIcon, UserIcon, CartIcon, MenuIcon, HeartIcon, PackageIcon, SettingsIcon } from "./icons";
import { SignInModal } from "../auth/SignInModal";
import { SearchDropdown } from "./SearchDropdown";
import { useDebounce } from "../../hooks/useDebounce";
import { useClickOutside } from "../../hooks/useClickOutside";

export function ButterHeader() {
  const [stickyMenu, setStickyMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Wishlist count (placeholder - will wire to state later)
  const wishlistCount = 0;

  // Close search dropdown on click outside
  useClickOutside(searchRef, () => {
    if (searchOpen) {
      setSearchOpen(false);
    }
  });

  // Close search on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [searchOpen]);

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
        backgroundColor="$primary"
        paddingHorizontal="$4"
        paddingVertical="$4"
        $md={{ paddingHorizontal: "$6", paddingVertical: "$5" }}
        {...(stickyMenu && {
          shadowColor: "rgba(0,0,0,0.12)",
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
        })}
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
            <Row alignItems="center" gap="$2" paddingVertical="$2">
              <img
                src="/logo-orange.png"
                alt="ButterGolf"
                style={{
                  height: "72px",
                  width: "auto",
                }}
              />
            </Row>
          </Link>

          {/* Center Navigation - Desktop Only */}
          <Row
            display="none"
            $lg={{ display: "flex" }}
            gap="$6"
            $xl={{ gap: "$8" }}
            alignItems="center"
            justifyContent="center"
            flex={1}
          >
            <Link href="/" style={{ textDecoration: "none" }}>
              <Text
                size="md"
                weight="semibold"
                color="$textInverse"
                cursor="pointer"
                letterSpacing={1}
                hoverStyle={{
                  textDecorationLine: "underline",
                  textDecorationColor: "$textInverse",
                }}
              >
                HOME
              </Text>
            </Link>
            <Link href="/features" style={{ textDecoration: "none" }}>
              <Text
                size="md"
                weight="semibold"
                color="$textInverse"
                cursor="pointer"
                letterSpacing={1}
                hoverStyle={{
                  textDecorationLine: "underline",
                  textDecorationColor: "$textInverse",
                }}
              >
                FEATURES
              </Text>
            </Link>
            <Link href="/about" style={{ textDecoration: "none" }}>
              <Text
                size="md"
                weight="semibold"
                color="$textInverse"
                cursor="pointer"
                letterSpacing={1}
                hoverStyle={{
                  textDecorationLine: "underline",
                  textDecorationColor: "$textInverse",
                }}
              >
                ABOUT US
              </Text>
            </Link>
            <Link href="/contact" style={{ textDecoration: "none" }}>
              <Text
                size="md"
                weight="semibold"
                color="$textInverse"
                cursor="pointer"
                letterSpacing={1}
                hoverStyle={{
                  textDecorationLine: "underline",
                  textDecorationColor: "$textInverse",
                }}
              >
                CONTACT US
              </Text>
            </Link>
          </Row>

          {/* Right Side: Search + Actions */}
          <Row
            gap="$2"
            $md={{ gap: "$3" }}
            alignItems="center"
            flexShrink={0}
            justifyContent="flex-end"
          >
            {/* Search Bar - Desktop */}
            <Column
              display="none"
              $md={{ display: "flex" }}
              {...{ style: { position: "relative" } }}
              ref={searchRef}
            >
              <Row
                backgroundColor="transparent"
                borderWidth={3}
                borderColor="$textInverse"
                borderRadius="$full"
                paddingHorizontal="$4"
                paddingVertical="$2"
                alignItems="center"
                gap="$2"
                width={250}
                hoverStyle={{
                  borderColor: "rgba(255, 255, 255, 0.8)",
                }}
                focusStyle={{
                  borderColor: "$textInverse",
                }}
              >
                <Row color="$textInverse">
                  <SearchIcon />
                </Row>
                <input
                  type="text"
                  placeholder=""
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "14px",
                    width: "100%",
                    fontFamily: "inherit",
                    color: "#fff",
                  }}
                />
              </Row>

              {/* Search Dropdown */}
              {searchOpen && (
                <Column
                  {...{ style: { position: "absolute" } }}
                  top="100%"
                  left={0}
                  marginTop="$2"
                  backgroundColor="$background"
                  borderWidth={1}
                  borderColor="$border"
                  borderRadius="$lg"
                  minWidth={400}
                  maxHeight={500}
                  zIndex={60}
                  shadowColor="rgba(0,0,0,0.15)"
                  shadowRadius={16}
                  shadowOffset={{ width: 0, height: 4 }}
                  overflow="hidden"
                >
                  <SearchDropdown
                    query={debouncedQuery}
                    onSelect={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                  />
                </Column>
              )}
            </Column>

            {/* Search Icon - Mobile */}
            <Row
              display="flex"
              $md={{ display: "none" }}
              cursor="pointer"
              hoverStyle={{ opacity: 0.8 }}
              padding="$2"
              minWidth={44}
              minHeight={44}
              alignItems="center"
              justifyContent="center"
              color="$textInverse"
            >
              <SearchIcon />
            </Row>

            {/* User Icon/Button */}
            <SignedOut>
              <Row
                tag="button"
                cursor="pointer"
                hoverStyle={{ opacity: 0.8 }}
                padding="$2"
                minWidth={44}
                minHeight={44}
                alignItems="center"
                justifyContent="center"
                {...{ style: { background: "none", border: "none" } }}
                onPress={() => {
                  setAuthMode("sign-in");
                  setAuthOpen(true);
                }}
                aria-label="Sign in"
                color="$textInverse"
              >
                <UserIcon />
              </Row>
            </SignedOut>

            <SignedIn>
              <Link href="/settings" style={{ textDecoration: "none" }}>
                <Row
                  cursor="pointer"
                  hoverStyle={{ opacity: 0.8 }}
                  padding="$2"
                  minWidth={44}
                  minHeight={44}
                  alignItems="center"
                  justifyContent="center"
                  color="$textInverse"
                >
                  <SettingsIcon />
                </Row>
              </Link>

              <Row
                minWidth={44}
                minHeight={44}
                alignItems="center"
                justifyContent="center"
              >
                <div style={{ filter: "brightness(0) invert(1)" }}>
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10"
                      }
                    }}
                  />
                </div>
              </Row>
            </SignedIn>

            {/* Wishlist */}
            <Link href="/wishlist" style={{ textDecoration: "none" }}>
              <Row
                position="relative"
                cursor="pointer"
                hoverStyle={{ opacity: 0.8 }}
                padding="$2"
                minWidth={44}
                minHeight={44}
                alignItems="center"
                justifyContent="center"
                color="$textInverse"
              >
                <HeartIcon />
                {wishlistCount > 0 && (
                  <Row
                    position="absolute"
                    top={4}
                    right={4}
                    width={18}
                    height={18}
                    backgroundColor="$navy500"
                    borderRadius={9}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      size="xs"
                      fontSize={10}
                      weight="bold"
                      color="$textInverse"
                    >
                      {wishlistCount}
                    </Text>
                  </Row>
                )}
              </Row>
            </Link>

            {/* Orders/Purchases */}
            <Link href="/orders" style={{ textDecoration: "none" }}>
              <Row
                cursor="pointer"
                hoverStyle={{ opacity: 0.8 }}
                padding="$2"
                minWidth={44}
                minHeight={44}
                alignItems="center"
                justifyContent="center"
                color="$textInverse"
              >
                <PackageIcon />
              </Row>
            </Link>

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
              color="$textInverse"
            >
              <MenuIcon />
            </Row>
          </Row>
        </Row>
      </Row>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <Column
          {...{ style: { position: "fixed" } }}
          top={100} // Below header (increased height)
          left={0}
          right={0}
          bottom={0}
          backgroundColor="$primary"
          zIndex={45}
          paddingHorizontal="$6"
          paddingVertical="$8"
          gap="$6"
        >
          <Link
            href="/"
            style={{ textDecoration: "none" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Text size="xl" weight="bold" color="$textInverse">
              HOME
            </Text>
          </Link>
          <Link
            href="/features"
            style={{ textDecoration: "none" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Text size="xl" weight="bold" color="$textInverse">
              FEATURES
            </Text>
          </Link>
          <Link
            href="/about"
            style={{ textDecoration: "none" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Text size="xl" weight="bold" color="$textInverse">
              ABOUT US
            </Text>
          </Link>
          <Link
            href="/contact"
            style={{ textDecoration: "none" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Text size="xl" weight="bold" color="$textInverse">
              CONTACT US
            </Text>
          </Link>

          {/* Mobile Search */}
          <Column gap="$3" marginTop="$4">
            <Text size="sm" weight="medium" color="$textInverse" opacity={0.8}>
              SEARCH
            </Text>
            <Row
              backgroundColor="rgba(255, 255, 255, 0.2)"
              borderRadius="$lg"
              paddingHorizontal="$3"
              paddingVertical="$3"
              alignItems="center"
              gap="$2"
            >
              <Row color="$textInverse">
                <SearchIcon />
              </Row>
              <input
                type="text"
                placeholder="Search golf equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "16px",
                  width: "100%",
                  fontFamily: "inherit",
                  color: "#fff",
                }}
              />
            </Row>

            {/* Mobile Search Results */}
            {searchQuery.trim().length >= 2 && (
              <Column
                backgroundColor="$background"
                borderRadius="$lg"
                overflow="hidden"
                maxHeight={400}
                borderWidth={1}
                borderColor="rgba(255, 255, 255, 0.3)"
              >
                <SearchDropdown
                  query={debouncedQuery}
                  onSelect={() => {
                    setSearchQuery("");
                    setMobileMenuOpen(false);
                  }}
                />
              </Column>
            )}
          </Column>
        </Column>
      )}

      {/* Auth modal */}
      <SignInModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        mode={authMode}
      />
    </>
  );
}
