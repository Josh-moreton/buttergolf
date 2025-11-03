"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Row, Column, Text } from "@buttergolf/ui";
import { menuData } from "./menuData";
import { DesktopMenu } from "./DesktopMenu";
import { SearchIcon, UserIcon, HeartIcon, CartIcon, MenuIcon } from "./icons";
import { SignInModal } from "../auth/SignInModal";

export function MarketplaceHeader() {
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
    <Column
      {...{ style: { position: "fixed" } }}
      top={0}
      left={0}
      right={0}
      zIndex={50}
      backgroundColor="$background"
      animation="quick"
      {...(stickyMenu && {
        shadowColor: "$shadowColor",
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      })}
    >
      {/* Top Bar - Hidden on mobile for cleaner UX */}
      <Row
        display="none"
        $md={{ display: "flex" }}
        backgroundColor="$primary"
        paddingVertical="$2.5"
        paddingHorizontal="$4"
        justify="center"
      >
        <Row
          width="100%"
          maxWidth={1280}
          justify="between"
          align="center"
        >
          <Row display="none" $lg={{ display: "flex" }}>
            <Text color="$textInverse" size="sm" weight="medium">
              Get free delivery on orders over £100
            </Text>
          </Row>

          <Row gap="$3" align="center">
            <SignedOut>
              <Row
                tag="button"
                cursor="pointer"
                style={{ background: "none", border: "none" }}
                onPress={() => {
                  setAuthMode("sign-up");
                  setAuthOpen(true);
                }}
              >
                <Text
                  color="$textInverse"
                  size="sm"
                  weight="medium"
                  paddingRight="$3"
                  borderRightWidth={1}
                  borderColor="$border"
                  hoverStyle={{ color: "$textInverse" }}
                >
                  Create an account
                </Text>
              </Row>
              <Row
                tag="button"
                cursor="pointer"
                style={{ background: "none", border: "none" }}
                onPress={() => {
                  setAuthMode("sign-in");
                  setAuthOpen(true);
                }}
              >
                <Text
                  color="$textInverse"
                  size="sm"
                  weight="medium"
                  paddingLeft="$3"
                  hoverStyle={{ color: "$textInverse" }}
                >
                  Sign In
                </Text>
              </Row>
            </SignedOut>
            <SignedIn>
              <Text color="$textInverse" size="sm" weight="medium">
                Welcome back!
              </Text>
            </SignedIn>
          </Row>
        </Row>
      </Row>

      {/* Main Header */}
      <Row
        paddingHorizontal="$3"
        paddingVertical="$3"
        $md={{ paddingHorizontal: "$4", paddingVertical: "$4" }}
        justify="center"
      >
        <Row
          width="100%"
          maxWidth={1280}
          justify="between"
          align="center"
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <Row
              align="center"
              gap="$2"
              paddingVertical="$2"
              // Ensure minimum touch target size
              minHeight={44}
            >
              <Text
                size="lg"
                $md={{ fontSize: 24 }}
                weight="bold"
                fontWeight="800"
                color="$text"
              >
                ButterGolf
              </Text>
              <Row
                backgroundColor="$primary"
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                $md={{ paddingHorizontal: "$3", paddingVertical: "$1" }}
                borderRadius="$3"
                borderTopRightRadius="$4"
                borderBottomRightRadius="$4"
              >
                <Text
                  size="xs"
                  $md={{ size: "sm" }}
                  weight="medium"
                  color="$textInverse"
                >
                  Beta
                </Text>
              </Row>
            </Row>
          </Link>

          {/* Desktop Menu - Hidden on mobile */}
          <Row display="none" $xl={{ display: "flex" }}>
            <DesktopMenu menuData={menuData} stickyMenu={stickyMenu} />
          </Row>

          {/* Action Buttons - Improved touch targets */}
          <Row gap="$2" $md={{ gap: "$3" }} align="center">
            {/* Sell Button - Prominent CTA */}
            <Link href="/sell" style={{ textDecoration: "none" }}>
              <Row
                backgroundColor="$primary"
                paddingHorizontal="$3"
                $md={{ paddingHorizontal: "$4" }}
                paddingVertical="$2"
                borderRadius="$lg"
                cursor="pointer"
                hoverStyle={{
                  backgroundColor: "$primaryHover",
                  scale: 1.02,
                }}
                pressStyle={{
                  backgroundColor: "$primaryPress",
                  scale: 0.98,
                }}
                minHeight={40}
                align="center"
                justify="center"
              >
                <Text size="sm" weight="semibold" color="$textInverse">
                  Sell
                </Text>
              </Row>
            </Link>

            <Row
              tag="button"
              cursor="pointer"
              hoverStyle={{ opacity: 0.7 }}
              // Minimum 44px touch target
              padding="$2"
              minWidth={44}
              minHeight={44}
              align="center"
              justify="center"
              {...{ style: { background: "none", border: "none" } }}
              aria-label="Search"
            >
              <SearchIcon />
            </Row>

            <SignedOut>
              <Row
                tag="button"
                cursor="pointer"
                hoverStyle={{ opacity: 0.7 }}
                padding="$2"
                minWidth={44}
                minHeight={44}
                align="center"
                justify="center"
                {...{ style: { background: "none", border: "none" } }}
                onPress={() => {
                  setAuthMode("sign-in");
                  setAuthOpen(true);
                }}
                aria-label="Sign in"
                style={{ background: "none", border: "none" }}
              >
                <UserIcon />
              </Row>
            </SignedOut>

            <SignedIn>
              <Row
                minWidth={44}
                minHeight={44}
                align="center"
                justify="center"
              >
                <UserButton />
              </Row>
            </SignedIn>

            <Link href="/wishlist" style={{ textDecoration: "none" }}>
              <Row
                position="relative"
                cursor="pointer"
                hoverStyle={{ opacity: 0.7 }}
                padding="$2"
                minWidth={44}
                minHeight={44}
                align="center"
                justify="center"
              >
                <HeartIcon />
                {wishlistCount > 0 && (
                  <Row
                    position="absolute"
                    top={4}
                    right={4}
                    width={18}
                    height={18}
                    backgroundColor="$primary"
                    borderRadius={9}
                    align="center"
                    justify="center"
                  >
                    <Text
                      size="xs"
                      fontSize={10}
                      weight="normal"
                      color="$textInverse"
                    >
                      {wishlistCount}
                    </Text>
                  </Row>
                )}
              </Row>
            </Link>

            <Link href="/cart" style={{ textDecoration: "none" }}>
              <Row
                position="relative"
                cursor="pointer"
                hoverStyle={{ opacity: 0.7 }}
                padding="$2"
                minWidth={44}
                minHeight={44}
                align="center"
                justify="center"
              >
                <CartIcon />
                {cartCount > 0 && (
                  <Row
                    position="absolute"
                    top={4}
                    right={4}
                    width={18}
                    height={18}
                    backgroundColor="$primary"
                    borderRadius={9}
                    align="center"
                    justify="center"
                  >
                    <Text
                      size="xs"
                      fontSize={10}
                      weight="normal"
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
              $xl={{ display: "none" }}
              tag="button"
              cursor="pointer"
              hoverStyle={{ opacity: 0.7 }}
              padding="$2"
              minWidth={44}
              minHeight={44}
              align="center"
              justify="center"
              onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
              {...{ style: { background: "none", border: "none" } }}
              aria-label="Menu"
            >
              <MenuIcon />
            </Row>
          </Row>
        </Row>
      </Row>
      {/* Auth modal */}
      <SignInModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        mode={authMode}
      />
    </Column>
  );
}
