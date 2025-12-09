"use client";

import "@tamagui/core/reset.css";
import "@tamagui/polyfill-dev";

import type { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { useServerInsertedHTML } from "next/navigation";
import { NextThemeProvider, useRootTheme } from "@tamagui/next-theme";
import { config } from "@buttergolf/config";

import { Provider } from "./Provider";

export function NextTamaguiProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [currentTheme, setTheme] = useRootTheme();

  useServerInsertedHTML(() => {
    // Get React Native Web stylesheet for proper styling
    // @ts-ignore - RN types don't include getSheet but it exists on web
    const rnwStyle = StyleSheet.getSheet();
    return (
      <>
        {/* React Native Web styles - required for proper component styling */}
        <style
          dangerouslySetInnerHTML={{ __html: rnwStyle.textContent }}
          id={rnwStyle.id}
        />
        {/* Tamagui compiled CSS file */}
        <link rel="stylesheet" href="/tamagui.css" />
        {/* Dynamic Tamagui CSS - includes all design tokens and themes
            Note: Some duplication with tamagui.css is acceptable to ensure
            themes are always available in all deployment environments */}
        <style
          dangerouslySetInnerHTML={{
            __html: config.getCSS(),
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
    <NextThemeProvider
      skipNextHead
      defaultTheme="system"
      onChangeTheme={(next) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setTheme(next as any);
      }}
    >
      <Provider defaultTheme={currentTheme ?? "light"}>{children}</Provider>
    </NextThemeProvider>
  );
}
