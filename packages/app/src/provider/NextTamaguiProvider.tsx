"use client";

import "@tamagui/core/reset.css";
import "@tamagui/polyfill-dev";

import type { ReactNode } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { NextThemeProvider, useRootTheme } from "@tamagui/next-theme";
import { config } from "@buttergolf/config";

import { Provider } from "./Provider";

export function NextTamaguiProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [currentTheme, setTheme] = useRootTheme();

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
