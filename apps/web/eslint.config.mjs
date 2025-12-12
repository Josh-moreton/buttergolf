import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      ".tamagui/**",
    ],
  },
  {
    files: ["*.config.js", "*.config.mjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  {
    // Prevent "Missing theme" errors from useRootTheme() during hydration
    // This pattern causes race conditions with React 19 concurrent rendering
    // See commit d8df9ed for previous fix
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@tamagui/next-theme",
              importNames: ["useRootTheme", "NextThemeProvider"],
              message:
                "useRootTheme() causes 'Missing theme' hydration errors. Use hardcoded defaultTheme='light' instead. See commit d8df9ed.",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
