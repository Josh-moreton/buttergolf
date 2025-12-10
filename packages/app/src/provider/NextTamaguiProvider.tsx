"use client";

import "@tamagui/core/reset.css";
import "@tamagui/polyfill-dev";

import type { ReactNode } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { NextThemeProvider, useRootTheme } from "@tamagui/next-theme";
import { config } from "@buttergolf/config";

import { Provider } from "./Provider";

/**
 * Inner component that consumes the theme context
 * MUST be rendered INSIDE NextThemeProvider to use useRootTheme() hook
 */
function TamaguiThemeProvider({ children }: { children: ReactNode }) {
  const [theme] = useRootTheme(); // ✅ Safe - inside provider tree

  return <Provider defaultTheme={theme ?? "light"}>{children}</Provider>;
}

/**
 * Outer component that provides the theme context
 * Sets up NextThemeProvider and CSS injection for Tamagui
 */
export function NextTamaguiProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  useServerInsertedHTML(() => {
    return (
      <>
        <link rel="stylesheet" href="/tamagui.css" />
        <style
          dangerouslySetInnerHTML={{
            __html: config.getCSS({
              exclude: "design-system",
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            // avoid flash of animated things on enter:
            __html: `document.documentElement.classList.add('t_unmounted')`,
          }}
        />
      </>
    );
  });

  return (
    <NextThemeProvider skipNextHead defaultTheme="system">
      <TamaguiThemeProvider>{children}</TamaguiThemeProvider>
    </NextThemeProvider>
  );
}
