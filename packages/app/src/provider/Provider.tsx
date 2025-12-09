// Import config BEFORE importing TamaguiProvider to ensure createTamagui runs first
import { config } from "@buttergolf/config";
import type { PropsWithChildren } from "react";
import { TamaguiProvider, type TamaguiProviderProps } from "tamagui";

export type ProviderProps = PropsWithChildren<
  Omit<TamaguiProviderProps, "config" | "children"> & {
    defaultTheme?: string;
  }
>;

// Valid base themes that exist in our Tamagui config
const VALID_THEMES = ["light", "dark"] as const;

export function Provider({ defaultTheme, children, ...rest }: ProviderProps) {
  // CRITICAL: Don't use useColorScheme() here as it causes hydration mismatches
  // Server returns null/undefined, client returns actual device preference
  // This causes React to detect mismatch, throw away DOM, and re-render with errors
  //
  // Instead, trust the defaultTheme prop which comes from NextThemeProvider
  // NextThemeProvider properly handles SSR hydration with useRootTheme()

  // Validate theme exists - "system" from NextThemeProvider isn't a valid Tamagui theme
  // Fall back to "light" if invalid or undefined (must be deterministic for SSR)
  const isValidTheme =
    defaultTheme && VALID_THEMES.includes(defaultTheme as (typeof VALID_THEMES)[number]);
  const theme = isValidTheme ? defaultTheme : "light";

  return (
    <TamaguiProvider
      // Type assertion required due to React Native version conflicts in monorepo:
      // - packages/app uses RN 0.82.1 (from Expo SDK 54)
      // - packages/ui uses RN 0.81.5 (peer dependency)
      // This creates incompatible StackProps types in defaultProps.
      // The config is valid at runtime - only type checking fails.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config={config as any}
      defaultTheme={theme}
      {...rest}
    >
      {children}
    </TamaguiProvider>
  );
}
