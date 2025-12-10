"use client";

import { useEffect, useState } from "react";
import { useRootTheme } from "@tamagui/next-theme";
import { Button } from "@buttergolf/ui";
import { Moon, Sun } from "lucide-react";

export function ThemeToggleButton() {
  const [theme, setTheme] = useRootTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  // Show fallback during SSR/hydration to prevent mismatch
  if (!mounted) {
    return (
      <Button
        size="$4"
        chromeless
        circular
        aria-label="Toggle theme"
        suppressHydrationWarning
        hoverStyle={{
          backgroundColor: "$background",
          opacity: 0.8,
        }}
        pressStyle={{
          scale: 0.95,
        }}
      >
        <Sun size={20} />
      </Button>
    );
  }

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
