// Import config BEFORE importing TamaguiProvider to ensure createTamagui runs first
import { config } from "@buttergolf/config";
import type { PropsWithChildren } from "react";
import { useColorScheme } from "react-native";
import { TamaguiProvider, type TamaguiProviderProps } from "tamagui";

export type ProviderProps = PropsWithChildren<
  Omit<TamaguiProviderProps, "config" | "children"> & {
    defaultTheme?: string;
  }
>;

// Valid base themes that exist in our Tamagui config
const VALID_THEMES = ["light", "dark"] as const;

export function Provider({ defaultTheme, children, ...rest }: ProviderProps) {
  const colorScheme = useColorScheme();

  // Validate theme exists - "system" from NextThemeProvider isn't a valid Tamagui theme
  // Fall back to colorScheme-based theme if defaultTheme is invalid or undefined
  const isValidTheme =
    defaultTheme && VALID_THEMES.includes(defaultTheme as (typeof VALID_THEMES)[number]);
  const theme = isValidTheme
    ? defaultTheme
    : colorScheme === "dark"
      ? "dark"
      : "light";

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
