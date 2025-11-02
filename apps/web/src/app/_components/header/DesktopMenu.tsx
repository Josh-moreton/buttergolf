"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { XStack, YStack, Text } from "@buttergolf/ui"
import type { MenuItem } from "./menuData"
import { ChevronDownIcon } from "./icons"

interface DesktopMenuProps {
  menuData: MenuItem[]
  stickyMenu: boolean
}

export function DesktopMenu({ menuData, stickyMenu }: Readonly<DesktopMenuProps>) {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const pathname = usePathname()

  return (
    <XStack tag="nav" {...{ gap: "xl" as any }} alignItems="center">
      {menuData.map((menuItem) => {
        const hasSubmenu = Boolean(menuItem.submenu)
        const isActive = menuItem.path && pathname.split("?")[0] === menuItem.path.split("?")[0]
        const menuIndex = menuData.indexOf(menuItem)

        return (
          <YStack
            key={menuItem.title}
            position="relative"
            onMouseEnter={() => setActiveDropdown(menuIndex)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            {hasSubmenu ? (
              <>
                <XStack
                  tag="button"
                  alignItems="center"
                  {...{ gap: "xs" as any }}
                  cursor="pointer"
                  paddingVertical={stickyMenu ? "$4" : "$6"}
                  {...{ style: { background: "none", border: "none" } }}
                >
                  <Text
                    size="sm"
                    weight="medium"
                    {...{ color: (isActive ? "primary" : "default") as any }}
                  >
                    {menuItem.title}
                  </Text>
                  <YStack
                    transform={
                      activeDropdown === menuIndex ? [{ rotate: "180deg" }] : undefined
                    }
                    animation="quick"
                  >
                    <ChevronDownIcon />
                  </YStack>
                </XStack>

                <YStack
                  position="absolute"
                  left={0}
                  top="100%"
                  backgroundColor="$background"
                  borderWidth={1}
                  borderColor="$border"
                  borderRadius="$4"
                  padding="$2"
                  minWidth={220}
                  zIndex={50}
                  opacity={activeDropdown === menuIndex ? 1 : 0}
                  y={activeDropdown === menuIndex ? 0 : 8}
                  pointerEvents={activeDropdown === menuIndex ? "auto" : "none"}
                  animation="quick"
                  shadowColor="$shadowColor"
                  shadowRadius={16}
                  shadowOffset={{ width: 0, height: 4 }}
                >
                  {menuItem.submenu?.map((subItem) => (
                    <Link
                      key={subItem.title}
                      href={subItem.path || "#"}
                      style={{ textDecoration: "none" }}
                    >
                      <XStack
                        paddingHorizontal="$4"
                        paddingVertical="$2"
                        borderRadius="$3"
                        hoverStyle={{ backgroundColor: "$backgroundHover" }}
                      >
                        <Text
                          size="sm"
                          weight="medium"
                          {...{ color: (
                            subItem.path &&
                            pathname.split("?")[0] === subItem.path.split("?")[0]
                              ? "primary"
                              : "default"
                          ) as any }}
                        >
                          {subItem.title}
                        </Text>
                      </XStack>
                    </Link>
                  ))}
                </YStack>
              </>
            ) : (
              <Link href={menuItem.path || "#"} style={{ textDecoration: "none" }}>
                <Text
                  size="sm"
                  weight="medium"
                  paddingVertical={stickyMenu ? "$4" : "$6"}
                  {...{ color: (isActive ? "primary" : "default") as any }}
                >
                  {menuItem.title}
                </Text>
              </Link>
            )}
          </YStack>
        )
      })}
    </XStack>
  )
}
