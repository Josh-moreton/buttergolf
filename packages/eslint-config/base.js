import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    rules: {
      // Prevent importing Tamagui config from @buttergolf/ui (deprecated)
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@buttergolf/ui/tamagui.config*"],
              message:
                "Import Tamagui config from '@buttergolf/config' instead of '@buttergolf/ui/tamagui.config'. The config source of truth lives in packages/config/src/tamagui.config.ts",
            },
          ],
          paths: [
            {
              name: "@buttergolf/ui",
              importNames: ["config"],
              message:
                "Import Tamagui config from '@buttergolf/config' instead of '@buttergolf/ui'. Use: import { config } from '@buttergolf/config'",
            },
          ],
        },
      ],
      // ========================================================================
      // BRITISH SPELLING ENFORCEMENT
      // Use British spellings in identifiers. Note: CSS properties (color, center)
      // and JavaScript APIs (behavior in scrollIntoView) cannot be changed.
      // ========================================================================
      "no-restricted-syntax": [
        "warn",
        {
          // Flag 'favorite' in identifiers (variables, functions, properties)
          selector: "Identifier[name=/favorite/i]",
          message: "Use British spelling 'favourite' instead of 'favorite'.",
        },
        {
          // Flag 'favorites' in identifiers
          selector: "Identifier[name=/favorites/i]",
          message: "Use British spelling 'favourites' instead of 'favorites'.",
        },
      ],
    },
  },
  {
    ignores: ["dist/**"],
  },
];
