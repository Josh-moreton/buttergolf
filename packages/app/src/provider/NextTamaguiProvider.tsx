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
        {/* Dynamic Tamagui CSS - exclude design-system only when outputCSS is used */}
        <style
          dangerouslySetInnerHTML={{
            __html: config.getCSS({
              // Only exclude design-system in production when the CSS file is generated
              // In development/preview, include all CSS to ensure themes work
              exclude:
                process.env.NODE_ENV === "production" ? "design-system" : null,
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
