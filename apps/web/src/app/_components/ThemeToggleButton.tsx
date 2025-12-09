"use client";

import { useRootTheme } from "@tamagui/next-theme";
import { Button } from "@buttergolf/ui";
import { Moon, Sun } from "lucide-react";

export function ThemeToggleButton() {
  const [theme, setTheme] = useRootTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Show Sun icon when in dark mode (clicking will make it light)
  // Show Moon icon when in light mode (clicking will make it dark)
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <Button
      size="$4"
      chromeless
      onPress={toggleTheme}
      circular
      icon={<Icon size={20} />}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      hoverStyle={{
        backgroundColor: "$background",
        opacity: 0.8,
      }}
      pressStyle={{
        scale: 0.95,
      }}
    />
  );
}
