"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Row, Column, Text } from "@buttergolf/ui";
import { SearchIcon, UserIcon, HeartIcon, CartIcon, MenuIcon } from "./icons";
import { SignInModal } from "../auth/SignInModal";

export function ButterHeader() {
  const [stickyMenu, setStickyMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in");

  // Wishlist and cart counts (placeholder - will wire to state later)
  const wishlistCount = 0;
  const cartCount = 0;

  // Sticky menu handler
  useEffect(() => {
    const handleStickyMenu = () => {
      setStickyMenu(window.scrollY >= 80);
    };

    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  return (
    <>
      <Row
        {...{ style: { position: "fixed" } }}
        top={40} // Below TrustBar (40px)
        left={0}
        right={0}
        zIndex={50}
        backgroundColor="$primary"
        paddingHorizontal="$4"
        paddingVertical="$3"
        $md={{ paddingHorizontal: "$6" }}
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
                  height: "50px",
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
                size="sm"
                weight="medium"
                color="$textInverse"
                cursor="pointer"
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
                size="sm"
                weight="medium"
                color="$textInverse"
                cursor="pointer"
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
                size="sm"
                weight="medium"
                color="$textInverse"
                cursor="pointer"
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
                size="sm"
                weight="medium"
                color="$textInverse"
                cursor="pointer"
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
            <Row
              display="none"
              $md={{ display: "flex" }}
              backgroundColor="rgba(255, 255, 255, 0.2)"
              backdropFilter="blur(10px)"
              borderRadius="$full"
              paddingHorizontal="$3"
              paddingVertical="$2"
              alignItems="center"
              gap="$2"
              width={250}
              hoverStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              }}
              focusStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.4)",
              }}
            >
              <Row color="$textInverse">
                <SearchIcon />
              </Row>
              <input
                type="text"
                placeholder="Search..."
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
              <Row
                minWidth={44}
                minHeight={44}
                alignItems="center"
                justifyContent="center"
              >
                <div style={{ filter: "brightness(0) invert(1)" }}>
                  <UserButton />
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

            {/* Cart */}
            <Link href="/cart" style={{ textDecoration: "none" }}>
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
                <CartIcon />
                {cartCount > 0 && (
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
                      {cartCount}
                    </Text>
                  </Row>
                )}
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
          top={120} // Below header
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
