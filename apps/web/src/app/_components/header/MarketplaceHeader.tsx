"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { YStack, XStack, Text } from "@buttergolf/ui"
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
    <YStack
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
      <XStack
        backgroundColor="$color12"
        paddingVertical="$2.5"
        paddingHorizontal="$4"
        justifyContent="center"
      >
        <XStack
          width="100%"
          maxWidth={1280}
          justifyContent="space-between"
          alignItems="center"
        >
          <XStack display="none" $lg={{ display: "flex" }}>
            <Text color="$color1" fontSize={14} fontWeight="500">
              Get free delivery on orders over £100
            </Text>
          </XStack>

          <XStack gap="$3" alignItems="center">
            <SignedOut>
              <XStack
                tag="button"
                cursor="pointer"
                {...{ style: { background: "none", border: "none" } }}
                onPress={() => { setAuthMode("sign-up"); setAuthOpen(true) }}
              >
                <Text
                  color="$color1"
                  fontSize={14}
                  fontWeight="500"
                  paddingRight="$3"
                  borderRightWidth={1}
                  borderColor="$color9"
                  hoverStyle={{ color: "$color9" }}
                >
                  Create an account
                </Text>
              </XStack>
              <XStack
                tag="button"
                cursor="pointer"
                {...{ style: { background: "none", border: "none" } }}
                onPress={() => { setAuthMode("sign-in"); setAuthOpen(true) }}
              >
                <Text
                  color="$color1"
                  fontSize={14}
                  fontWeight="500"
                  paddingLeft="$3"
                  hoverStyle={{ color: "$color9" }}
                >
                  Sign In
                </Text>
              </XStack>
            </SignedOut>
            <SignedIn>
              <Text color="$color1" fontSize={14} fontWeight="500">
                Welcome back!
              </Text>
            </SignedIn>
          </XStack>
        </XStack>
      </XStack>

      {/* Main Header */}
      <XStack paddingHorizontal="$4" paddingVertical="$4" justifyContent="center">
        <XStack
          width="100%"
          maxWidth={1280}
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <XStack alignItems="center" gap="$2" paddingVertical="$2">
              <Text fontSize={24} fontWeight="800" color="$color12">
                ButterGolf
              </Text>
              <XStack
                backgroundColor="$color9"
                paddingHorizontal="$3"
                paddingVertical="$1"
                borderRadius="$3"
                borderTopRightRadius="$4"
                borderBottomRightRadius="$4"
              >
                <Text color="$background" fontSize={14} fontWeight="500">
                  Beta
                </Text>
              </XStack>
            </XStack>
          </Link>

          {/* Desktop Menu - Hidden on mobile */}
          <XStack display="none" $xl={{ display: "flex" }}>
            <DesktopMenu menuData={menuData} stickyMenu={stickyMenu} />
          </XStack>

          {/* Action Buttons */}
          <XStack gap="$3" alignItems="center">
            <XStack
              tag="button"
              cursor="pointer"
              hoverStyle={{ opacity: 0.7 }}
              {...{ style: { background: "none", border: "none" } }}
              aria-label="Search"
            >
              <SearchIcon />
            </XStack>

            <SignedOut>
              <XStack
                tag="button"
                cursor="pointer"
                hoverStyle={{ opacity: 0.7 }}
                {...{ style: { background: "none", border: "none" } }}
                onPress={() => { setAuthMode("sign-in"); setAuthOpen(true) }}
                aria-label="Sign in"
              >
                <UserIcon />
              </XStack>
            </SignedOut>

            <SignedIn>
              {/* eslint-disable-next-line deprecation/deprecation */}
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <Link href="/wishlist" style={{ textDecoration: "none" }}>
              <XStack position="relative" cursor="pointer" hoverStyle={{ opacity: 0.7 }}>
                <HeartIcon />
                {wishlistCount > 0 && (
                  <XStack
                    position="absolute"
                    top={-6}
                    right={-6}
                    width={18}
                    height={18}
                    backgroundColor="$color9"
                    borderRadius={9}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="$background" fontSize={10} fontWeight="400">
                      {wishlistCount}
                    </Text>
                  </XStack>
                )}
              </XStack>
            </Link>

            <Link href="/cart" style={{ textDecoration: "none" }}>
              <XStack position="relative" cursor="pointer" hoverStyle={{ opacity: 0.7 }}>
                <CartIcon />
                {cartCount > 0 && (
                  <XStack
                    position="absolute"
                    top={-6}
                    right={-6}
                    width={18}
                    height={18}
                    backgroundColor="$color9"
                    borderRadius={9}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="$background" fontSize={10} fontWeight="400">
                      {cartCount}
                    </Text>
                  </XStack>
                )}
              </XStack>
            </Link>

            {/* Mobile Menu Toggle */}
            <XStack
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
            </XStack>
          </XStack>
        </XStack>
      </XStack>
      {/* Auth modal */}
      <SignInModal open={authOpen} onClose={() => setAuthOpen(false)} mode={authMode} />
    </YStack>
  )
}
