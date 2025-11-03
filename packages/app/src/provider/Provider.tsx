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

export function Provider({ defaultTheme, ...rest }: ProviderProps) {
  const colorScheme = useColorScheme();
  const theme = defaultTheme ?? (colorScheme === "dark" ? "dark" : "light");

  return (
    <TamaguiProvider
      config={config}
      defaultTheme={theme}
      {...(rest as TamaguiProviderProps)}
    />
  );
}
