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
    },
  },
  {
    ignores: ["dist/**"],
  },
];
