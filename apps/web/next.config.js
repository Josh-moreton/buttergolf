const {withTamagui} = require("@tamagui/next-plugin");
const {join} = require("node:path");

const boolVals = {
  true: true,
  false: false,
};

// Keep style extraction enabled in all environments unless explicitly disabled
// Set DISABLE_EXTRACTION=true to opt out (useful when debugging compiler output)
const disableExtraction =
  boolVals[process.env.DISABLE_EXTRACTION] ?? false;

const plugins = [
  withTamagui({
    config: "../../packages/config/src/tamagui.config.ts",
    components: ["tamagui", "@buttergolf/ui"],
    appDir: true,
    // Always generate static CSS file for both dev and production
    // This ensures the file exists when NextTamaguiProvider loads it via <link> tag
    // Removing the NODE_ENV check prevents Vercel build timing issues
    outputCSS: "./public/tamagui.css",
    logTimings: true,
    disableExtraction,
    // Disable debug attributes to prevent hydration warnings
    // These are only useful for deep debugging of Tamagui compiler output
    useReactNativeWebLite: false,
    disableDebugAttr: true,
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
    // Mark Prisma as external to fix pnpm monorepo module resolution
    // Prisma generates client in a deeply nested path that Next.js bundler can't resolve
    serverExternalPackages: ['@prisma/client'],
    // Disable caching in development to avoid stale CSS issues
    ...(process.env.NODE_ENV === "development" && {
      headers: async () => [
        {
          source: "/:path*",
          headers: [
            {key: "Cache-Control", value: "no-store, must-revalidate"},
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
      "@tamagui/animations-css",
      "@tamagui/animations-react-native",
      "@tamagui/card",
      "@tamagui/toast",
      "@tamagui/next-theme",
      "@tamagui/sheet",
      "@tamagui/portal",
      "@tamagui/polyfill-dev",
    ],
    experimental: {
      scrollRestoration: true,
      // Allow Server Actions to work with dev tunnels and port forwarding
      serverActions: {
        allowedOrigins: [
          "localhost:3000",
          "ttdr3bz5-3000.uks1.devtunnels.ms",
        ],
      },
    },
    // Allow dev server access from local network devices (mobile testing, etc.)
    allowedDevOrigins: [
      "192.168.1.41:3000", // Add your local network IP
    ],
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "res.cloudinary.com",
        },
        {
          protocol: "https",
          hostname: "images.unsplash.com",
        },
      ],
    },
    webpack: (webpackConfig) => {
      // Map React Native to React Native Web for web builds
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        "react-native$": "react-native-web",
        // Enforce a single instance of 'tamagui' at runtime to avoid
        // "Haven't called createTamagui yet" errors caused by duplicate module instances
        tamagui: require.resolve("tamagui"),
        // Explicit alias for @tamagui/polyfill-dev to fix webpack resolution in pnpm monorepo
        "@tamagui/polyfill-dev": require.resolve("@tamagui/polyfill-dev"),
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
