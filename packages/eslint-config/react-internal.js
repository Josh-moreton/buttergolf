import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import { config as baseConfig } from "./base.js";

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config[]} */
export const config = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks,
      // deprecation: Not compatible with ESLint 9 yet
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
      // Prevent direct tamagui imports - use @buttergolf/ui instead
      // This ensures consistent component behavior and custom variants
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "tamagui",
              importNames: [
                "Spinner",
                "Button",
                "Input",
                "Text",
                "Heading",
                "Card",
                "Image",
                "ScrollView",
                "View",
                "XStack",
                "YStack",
              ],
              message:
                "Import UI components from '@buttergolf/ui' instead of 'tamagui' directly. Our UI package provides custom variants and consistent theming.",
            },
            {
              name: "jsdom",
              message:
                "jsdom is web-only and contains SharedArrayBuffer which React Native doesn't support. Use React Native Testing Library instead.",
            },
            {
              name: "@testing-library/jest-dom",
              message:
                "@testing-library/jest-dom is web-only. Use @testing-library/react-native for mobile testing.",
            },
            {
              name: "happy-dom",
              message:
                "happy-dom is web-only and contains SharedArrayBuffer which React Native doesn't support. Use React Native Testing Library instead.",
            },
            {
              name: "@vitest/browser",
              message:
                "@vitest/browser is web-only. Use vitest with environment: 'node' for cross-platform testing.",
            },
          ],
        },
      ],
    },
  },
];
