import { config as reactInternalConfig } from "@buttergolf/eslint-config/react-internal";

const eslintConfig = [
  ...reactInternalConfig,
  {
    // Expo-specific overrides can go here if needed
    rules: {
      // Add any Expo-specific rule customizations
    },
  },
];

export default eslintConfig;
