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
      // ========================================================================
      // IMPORT RESTRICTIONS - Enforce correct import paths in monorepo
      // ========================================================================
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
            // ================================================================
            // PRISMA CLIENT - Must import from @buttergolf/db
            // Direct @prisma/client imports cause "Cannot find module
            // '.prisma/client/default'" errors in pnpm monorepos due to
            // symlink resolution. Our custom output path fixes this.
            // ================================================================
            {
              name: "@prisma/client",
              message:
                "Import from '@buttergolf/db' instead of '@prisma/client'. Direct imports cause build failures in pnpm monorepos. Use: import { prisma, Prisma, ProductCondition } from '@buttergolf/db'",
            },
          ],
        },
      ],
      // ========================================================================
      // CONSOLE STATEMENTS - Prevent debug logs in production code
      // Allow console.error and console.warn for legitimate error handling
      // ========================================================================
      "no-console": [
        "warn",
        {
          allow: ["warn", "error", "info"],
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
  // ========================================================================
  // CIRCULAR DEPENDENCY PREVENTION FOR UI COMPONENTS
  // Components in packages/ui/src/components should import siblings directly,
  // not through the barrel index, to avoid circular dependencies.
  // ========================================================================
  {
    files: ["**/packages/ui/src/components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../index", "../index.ts", "../index.tsx"],
              message:
                "Do not import from the barrel index inside components/ to avoid circular dependencies. Use direct sibling imports instead, e.g.: import { Button } from './Button'",
            },
          ],
        },
      ],
    },
  },
  // ========================================================================
  // CROSS-PACKAGE IMPORT RESTRICTIONS
  // Enforce proper dependency direction in the monorepo:
  // - packages/* cannot import from apps/*
  // - packages/app can import from packages/ui but not vice versa
  // ========================================================================
  {
    files: ["**/packages/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/apps/web/**", "**/apps/mobile/**"],
              message:
                "Packages cannot import from apps. Move shared code to a package (e.g., @buttergolf/app or @buttergolf/ui).",
            },
          ],
        },
      ],
    },
  },
  // ========================================================================
  // PRISMA SINGLETON ENFORCEMENT
  // Only packages/db should create PrismaClient instances.
  // All other code must import the singleton from @buttergolf/db.
  // ========================================================================
  {
    files: ["**/apps/**/*.{ts,tsx}", "**/packages/app/**/*.{ts,tsx}", "**/packages/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "NewExpression[callee.name='PrismaClient']",
          message:
            "Do not create new PrismaClient instances. Import the singleton from '@buttergolf/db': import { prisma } from '@buttergolf/db'",
        },
      ],
    },
  },
];
