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
    rules: {
      // Downgrade to warning for Tamagui token workarounds
      // This is a temporary fix for the pattern: {...{ color: "$primary" as any }}
      // which is used to work around Tamagui's strict typing for semantic tokens
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    files: ["*.config.js", "*.config.mjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];

export default eslintConfig;
