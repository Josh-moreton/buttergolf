import type { PropsWithChildren } from "react";
import { useColorScheme } from "react-native";
import { TamaguiProvider, type TamaguiProviderProps } from "tamagui";
import { config } from "@buttergolf/ui";

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
