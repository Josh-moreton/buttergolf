"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Row, Column, Text } from "@buttergolf/ui"
import { menuData } from "./menuData"
import { DesktopMenu } from "./DesktopMenu"
import {
  SearchIcon,
  UserIcon,
  HeartIcon,
  CartIcon,
  MenuIcon,
} from "./icons"
import { SignInModal } from "../auth/SignInModal"

export function MarketplaceHeader() {
  const [stickyMenu, setStickyMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in")

  // Wishlist and cart counts (placeholder - will wire to state later)
  const wishlistCount = 0
  const cartCount = 0

  // Sticky menu handler
  useEffect(() => {
    const handleStickyMenu = () => {
      setStickyMenu(window.scrollY >= 80)
    }

    window.addEventListener("scroll", handleStickyMenu)
    return () => window.removeEventListener("scroll", handleStickyMenu)
  }, [])

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
      {/* Top Bar - Dark Theme Background */}
      <Row
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
            <Text
              // @ts-ignore - color variant type issue
              color="inverse"
              fontSize={14}
              fontWeight="500"
            >
              Get free delivery on orders over £100
            </Text>
          </Row>

          <Row gap="$3" align="center">
            <SignedOut>
              <Row
                tag="button"
                cursor="pointer"
                {...{ style: { background: "none", border: "none" } }}
                onPress={() => { setAuthMode("sign-up"); setAuthOpen(true) }}
              >
                <Text
                  // @ts-ignore - color variant type issue
                  color="inverse"
                  fontSize={14}
                  fontWeight="500"
                  paddingRight="$3"
                  borderRightWidth={1}
                  borderColor="$border"
                  // @ts-ignore - hoverStyle type issue
                  hoverStyle={{ color: "$textInverse" }}
                >
                  Create an account
                </Text>
              </Row>
              <Row
                tag="button"
                cursor="pointer"
                {...{ style: { background: "none", border: "none" } }}
                onPress={() => { setAuthMode("sign-in"); setAuthOpen(true) }}
              >
                <Text
                  // @ts-ignore - color variant type issue
                  color="inverse"
                  fontSize={14}
                  fontWeight="500"
                  paddingLeft="$3"
                  // @ts-ignore - hoverStyle type issue
                  hoverStyle={{ color: "$textInverse" }}
                >
                  Sign In
                </Text>
              </Row>
            </SignedOut>
            <SignedIn>
              <Text
                // @ts-ignore - color variant type issue
                color="inverse"
                fontSize={14}
                fontWeight="500"
              >
                Welcome back!
              </Text>
            </SignedIn>
          </Row>
        </Row>
      </Row>

      {/* Main Header */}
      <Row paddingHorizontal="$4" paddingVertical="$4" justify="center">
        <Row
          width="100%"
          maxWidth={1280}
          justify="between"
          align="center"
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <Row align="center" gap="$2" paddingVertical="$2">
              <Text
                fontSize={24}
                fontWeight="800"
                // @ts-ignore - color variant type issue
                color="default"
              >
                ButterGolf
              </Text>
              <Row
                backgroundColor="$primary"
                paddingHorizontal="$3"
                paddingVertical="$1"
                borderRadius="$3"
                borderTopRightRadius="$4"
                borderBottomRightRadius="$4"
              >
                <Text
                  fontSize={14}
                  fontWeight="500"
                  // @ts-ignore - color variant type issue
                  color="inverse"
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

          {/* Action Buttons */}
          <Row gap="$3" align="center">
            <Row
              tag="button"
              cursor="pointer"
              hoverStyle={{ opacity: 0.7 }}
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
                {...{ style: { background: "none", border: "none" } }}
                onPress={() => { setAuthMode("sign-in"); setAuthOpen(true) }}
                aria-label="Sign in"
              >
                <UserIcon />
              </Row>
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>

            <Link href="/wishlist" style={{ textDecoration: "none" }}>
              <Row position="relative" cursor="pointer" hoverStyle={{ opacity: 0.7 }}>
                <HeartIcon />
                {wishlistCount > 0 && (
                  <Row
                    position="absolute"
                    top={-6}
                    right={-6}
                    width={18}
                    height={18}
                    backgroundColor="$primary"
                    borderRadius={9}
                    align="center"
                    justify="center"
                  >
                    <Text
                      fontSize={10}
                      fontWeight="400"
                      // @ts-ignore - color variant type issue
                      color="inverse"
                    >
                      {wishlistCount}
                    </Text>
                  </Row>
                )}
              </Row>
            </Link>

            <Link href="/cart" style={{ textDecoration: "none" }}>
              <Row position="relative" cursor="pointer" hoverStyle={{ opacity: 0.7 }}>
                <CartIcon />
                {cartCount > 0 && (
                  <Row
                    position="absolute"
                    top={-6}
                    right={-6}
                    width={18}
                    height={18}
                    backgroundColor="$primary"
                    borderRadius={9}
                    align="center"
                    justify="center"
                  >
                    <Text
                      fontSize={10}
                      fontWeight="400"
                      // @ts-ignore - color variant type issue
                      color="inverse"
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
      <SignInModal open={authOpen} onClose={() => setAuthOpen(false)} mode={authMode} />
    </Column>
  )
}
