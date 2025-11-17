"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Row, Column, Text } from "@buttergolf/ui";
import { menuData } from "./menuData";
import { DesktopMenu } from "./DesktopMenu";
import { SearchIcon, UserIcon, HeartIcon, CartIcon, MenuIcon, PackageIcon } from "./icons";
import { SignInModal } from "../auth/SignInModal";

export function MarketplaceHeader() {
  const [stickyMenu, setStickyMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in");

  // Wishlist count (placeholder - will wire to state later)
  const wishlistCount = 0;

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
      style={{ position: "fixed" }}
      top={60}
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
      {/* Main Header */}
      <Row
        paddingHorizontal="$4"
        paddingVertical="$3"
        $md={{ paddingHorizontal: "$6", paddingVertical: "$4" }}
        justifyContent="center"
        borderBottomWidth={1}
        borderColor="$border"
      >
        <Row
          width="100%"
          maxWidth={1440}
          justifyContent="space-between"
          alignItems="center"
          gap="$4"
          $md={{ gap: "$6" }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <Row
              alignItems="center"
              gap="$2"
              paddingVertical="$2"
              minHeight={44}
            >
              <img
                src="/logo-orange.png"
                alt="ButterGolf"
                style={{
                  height: "32px",
                  width: "auto",
                }}
              />
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
                  size="$2"
                  $md={{ size: "sm" }}
                  weight="medium"
                  color="$textInverse"
                >
                  Beta
                </Text>
              </Row>
            </Row>
          </Link>

          {/* Search Bar - Prominent on desktop */}
          <Row
            display="none"
            $md={{ display: "flex" }}
            flex={1}
            maxWidth={500}
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$border"
            borderRadius="$lg"
            paddingHorizontal="$3"
            paddingVertical="$2"
            alignItems="center"
            gap="$2"
            hoverStyle={{
              borderColor: "$borderHover",
            }}
            focusStyle={{
              borderColor: "$primary",
              borderWidth: 2,
            }}
          >
            <SearchIcon />
            <input
              type="text"
              placeholder="What are you looking for?"
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "14px",
                width: "100%",
                fontFamily: "inherit",
              }}
            />
          </Row>

          {/* Action Buttons - Improved touch targets */}
          <Row gap="$2" $md={{ gap: "$3" }} alignItems="center" flexShrink={0}>
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
                alignItems="center"
                justifyContent="center"
              >
                <Text size="$3" weight="semibold" color="$textInverse">
                  Sell
                </Text>
              </Row>
            </Link>

            <SignedOut>
              <Row
                tag="button"
                cursor="pointer"
                hoverStyle={{ opacity: 0.7 }}
                padding="$2"
                minWidth={44}
                minHeight={44}
                alignItems="center"
                justifyContent="center"
                backgroundColor="transparent"
                borderWidth={0}
                onPress={() => {
                  setAuthMode("sign-in");
                  setAuthOpen(true);
                }}
                aria-label="Sign in"
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
                alignItems="center"
                justifyContent="center"
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
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      size="$2"
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

            <Link href="/orders" style={{ textDecoration: "none" }}>
              <Row
                cursor="pointer"
                hoverStyle={{ opacity: 0.7 }}
                padding="$2"
                minWidth={44}
                minHeight={44}
                alignItems="center"
                justifyContent="center"
              >
                <PackageIcon />
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
              alignItems="center"
              justifyContent="center"
              backgroundColor="transparent"
              borderWidth={0}
              onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <MenuIcon />
            </Row>
          </Row>
        </Row>
      </Row>

      {/* Mobile Search Bar */}
      <Row
        display="flex"
        $md={{ display: "none" }}
        paddingHorizontal="$4"
        paddingVertical="$3"
        backgroundColor="$surface"
        borderBottomWidth={1}
        borderColor="$border"
      >
        <Row
          flex={1}
          backgroundColor="$background"
          borderWidth={1}
          borderColor="$border"
          borderRadius="$lg"
          paddingHorizontal="$3"
          paddingVertical="$2"
          alignItems="center"
          gap="$2"
        >
          <SearchIcon />
          <input
            type="text"
            placeholder="Search golf equipment..."
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "14px",
              width: "100%",
              fontFamily: "inherit",
            }}
          />
        </Row>
      </Row>

      {/* Navigation Bar - Full width categories */}
      <Row
        display="none"
        $lg={{ display: "flex" }}
        paddingHorizontal="$6"
        paddingVertical="$3"
        justifyContent="center"
        backgroundColor="$surface"
        borderBottomWidth={1}
        borderColor="$border"
      >
        <Row width="100%" maxWidth={1440} justifyContent="center">
          <DesktopMenu menuData={menuData} stickyMenu={stickyMenu} />
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
