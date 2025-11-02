import { config as reactInternalConfig } from "@buttergolf/eslint-config/react-internal";

const eslintConfig = [
  ...reactInternalConfig,
  {
    files: ["*.config.js", "*.config.mjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off", // Config files run in Node.js
      "turbo/no-undeclared-env-vars": "off",
    },
  },
  {
    // Expo-specific overrides
    rules: {
      // Add any Expo-specific rule customizations
    },
  },
];

export default eslintConfig;
