const { withTamagui } = require("@tamagui/next-plugin");
const { join } = require("node:path");

const boolVals = {
  true: true,
  false: false,
};

// Enable extraction in both dev and prod for consistent styling
// Set DISABLE_EXTRACTION=true to disable (useful for debugging)
const disableExtraction =
  boolVals[process.env.DISABLE_EXTRACTION] ??
  process.env.NODE_ENV === "development";

const plugins = [
  withTamagui({
    config: "../../packages/config/src/tamagui.config.ts",
    components: ["tamagui", "@buttergolf/ui"],
    appDir: true,
    outputCSS:
      process.env.NODE_ENV === "production" ? "./public/tamagui.css" : null,
    logTimings: true,
    disableExtraction,
    shouldExtract: (path) => {
      if (path.includes(join("packages", "app"))) {
        return true;
      }
    },
    excludeReactNativeWebExports: [
      "Switch",
      "ProgressBar",
      "Picker",
      "CheckBox",
      "Touchable",
    ],
  }),
];

module.exports = () => {
  /** @type {import('next').NextConfig} */
  let config = {
    typescript: {
      // !! WARN !!
      // Temporarily disable type checking during build due to React 19 + Tamagui compatibility issues
      // This should be resolved when Tamagui updates its types for React 19
      ignoreBuildErrors: true,
    },
    // Disable caching in development to avoid stale CSS issues
    ...(process.env.NODE_ENV === "development" && {
      headers: async () => [
        {
          source: "/:path*",
          headers: [
            { key: "Cache-Control", value: "no-store, must-revalidate" },
          ],
        },
      ],
    }),
    transpilePackages: [
      "@buttergolf/app",
      "@buttergolf/config",
      "@buttergolf/ui",
      "react-native-web",
      "react-native",
      "solito",
      "expo-linking",
      "expo-constants",
      "expo-modules-core",
      "tamagui",
      "@tamagui/core",
      "@tamagui/web",
      "@tamagui/animations-react-native",
      "@tamagui/card",
      "@tamagui/toast",
      "@tamagui/next-theme",
    ],
    experimental: {
      scrollRestoration: true,
    },
    webpack: (webpackConfig) => {
      // Map React Native to React Native Web for web builds
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        "react-native$": "react-native-web",
      };

      return webpackConfig;
    },
  };

  for (const plugin of plugins) {
    config = {
      ...config,
      ...plugin(config),
    };
  }

  return config;
};
