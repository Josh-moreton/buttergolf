import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import { config as baseConfig, baseImportPatterns, baseImportPaths } from "./base.js";

// ========================================================================
// REACT IMPORT RESTRICTIONS - Exported for composition in app configs.
// Includes all base restrictions plus React-specific ones.
// ========================================================================
export const reactImportPatterns = [...baseImportPatterns];

export const reactImportPaths = [
  ...baseImportPaths,
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
      "TextArea",
      "Switch",
      "Sheet",
      "Popover",
      "Slider",
      "Checkbox",
      "Badge",
      "Label",
      "Radio",
      "RadioGroup",
      "Separator",
      "Theme",
    ],
    message:
      "Import UI components from '@buttergolf/ui' instead of 'tamagui' directly. Our UI package provides custom variants and consistent theming.",
  },
  {
    name: "@tamagui/sheet",
    message:
      "Import Sheet from '@buttergolf/ui' instead of '@tamagui/sheet' — deep imports bypass the design-system barrel.",
  },
  {
    name: "jsdom",
    message: "jsdom is web-only and contains SharedArrayBuffer which React Native doesn't support.",
  },
  {
    name: "happy-dom",
    message:
      "happy-dom is web-only and contains SharedArrayBuffer which React Native doesn't support.",
  },
];

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
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
      // TypeScript handles prop types validation, no need for prop-types rule
      "react/prop-types": "off",
      // Prevent fontSize prop on Text components - use size="$token" instead
      // Using fontSize bypasses Tamagui's variant system and causes lineHeight issues on React Native
      "react/forbid-component-props": [
        "error",
        {
          forbid: [
            {
              propName: "fontSize",
              allowedFor: [],
              message:
                'Use size="$token" instead of fontSize prop on Text components. fontSize bypasses the Tamagui variant system and causes invisible text on React Native (lineHeight becomes 1.5px instead of proper pixel values).',
            },
          ],
        },
      ],
      // Prevent raw HTML elements - use Tamagui components from @buttergolf/ui
      // Start as warnings to allow gradual migration, can be promoted to errors later
      "react/forbid-elements": [
        "warn",
        {
          forbid: [
            {
              element: "button",
              message:
                "Use <Button> from @buttergolf/ui instead of raw <button>. Tamagui Button provides consistent styling, accessibility, and cross-platform support.",
            },
            {
              element: "input",
              message:
                "Use <Input> from @buttergolf/ui instead of raw <input>. Tamagui Input provides size variants, semantic tokens, and consistent form styling.",
            },
            {
              element: "select",
              message:
                "No raw <select> — no DS Select exists; use tamagui Select directly with DS tokens (see SortDropdown) until one is built.",
            },
            {
              element: "textarea",
              message:
                "Use <TextArea> from @buttergolf/ui instead of raw <textarea>. Tamagui TextArea provides auto-resize, size variants, and consistent styling.",
            },
          ],
        },
      ],
      // Merged import restrictions: base (Prisma, config) + React-specific (direct tamagui, jsdom)
      "no-restricted-imports": [
        "error",
        {
          patterns: reactImportPatterns,
          paths: reactImportPaths,
        },
      ],
      // Spacing convention: the NAMED scale ($xs-$3xl) is canonical for
      // padding/margin/gap; numeric space tokens ($1-$20) are legacy and
      // migrated opportunistically. Not lint-enforced: ESLint flat config
      // REPLACES no-restricted-syntax per-rule rather than merging, so adding
      // a selector here would clobber the British-spelling and PrismaClient
      // selectors from base.js. Revisit as a dedicated plugin rule if drift
      // continues. Convention documented in .claude/CLAUDE.md.
    },
  },
];
