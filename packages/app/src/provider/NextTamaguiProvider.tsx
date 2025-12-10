"use client";

import "@tamagui/core/reset.css";
import "@tamagui/polyfill-dev";

import type { ReactNode } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { config } from "@buttergolf/config";

import { Provider } from "./Provider";

/**
 * Tamagui Provider for Next.js App Router
 * Fixed to light theme for v1 - theme switching disabled
 * 
 * TODO: Properly design and test light/dark theme variants
 * - Design dark theme colors in Figma matching brand identity
 * - Update tamagui.config.ts with proper dark theme tokens
 * - Test all components in both themes for readability/contrast
 * - Re-enable NextThemeProvider with useRootTheme() pattern:
 *   ```
 *   <NextThemeProvider skipNextHead defaultTheme="system">
 *     <TamaguiThemeProvider>{children}</TamaguiThemeProvider>
 *   </NextThemeProvider>
 *   ```
 * - Add theme toggle UI component in header/settings
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

  return <Provider defaultTheme="light">{children}</Provider>;
}
