const {withTamagui} = require("@tamagui/next-plugin");
const {join, resolve} = require("node:path");
const {PrismaPlugin} = require("@prisma/nextjs-monorepo-workaround-plugin");

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
    outputCSS:
      process.env.NODE_ENV === "production" ? "./public/tamagui.css" : null,
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

// Security headers for Clerk authentication with Cloudflare Turnstile bot protection
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: Allow self, Clerk, Cloudflare, Vercel Live, and necessary inline scripts
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://challenges.cloudflare.com https://vercel.live blob:",
      // Styles: Allow self, inline styles, and Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Images: Allow self, data URIs, Cloudinary, Vercel Blob Storage, and common image sources
      "img-src 'self' data: blob: https://res.cloudinary.com https://img.clerk.com https://*.clerk.accounts.dev https://images.unsplash.com https://*.public.blob.vercel-storage.com",
      // Fonts: Allow self and Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Connect: Allow API calls to self, Clerk, Cloudflare, and Stripe
      "connect-src 'self' https://*.clerk.accounts.dev https://clerk.buttergolf.com https://challenges.cloudflare.com https://api.stripe.com wss://*.clerk.accounts.dev",
      // Frames: Allow Clerk and Cloudflare challenge iframes
      "frame-src 'self' https://*.clerk.accounts.dev https://challenges.cloudflare.com https://js.stripe.com",
      // Workers: Allow blob for service workers
      "worker-src 'self' blob:",
      // Form actions
      "form-action 'self'",
      // Frame ancestors
      "frame-ancestors 'self'",
    ].join("; "),
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
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
    // Explicitly trace Prisma binaries from custom monorepo location
    // Required for Vercel deployment with custom Prisma output path
    // Paths are relative to outputFileTracingRoot (monorepo root)
    outputFileTracingIncludes: {
      '/api/**': [
        './packages/db/generated/client/**/*',
        './packages/db/prisma/schema.prisma',
      ],
      // Include for all server-side code
      '/**': [
        './packages/db/generated/client/**/*',
      ],
    },
    // Prevent Next.js from bundling Prisma Client (breaks native binaries)
    // Essential for monorepo setups with custom Prisma output paths
    serverExternalPackages: ['@buttergolf/db', '@prisma/client'],
    // Security and caching headers
    headers: async () => [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: [
          ...securityHeaders,
          // Disable caching in development
          ...(process.env.NODE_ENV === "development"
            ? [{key: "Cache-Control", value: "no-store, must-revalidate"}]
            : []),
        ],
      },
    ],
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
      "@tamagui/animations-css",
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
      // Set tracing root to monorepo root for proper workspace resolution
      outputFileTracingRoot: join(__dirname, '../../'),
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
    webpack: (webpackConfig, {isServer}) => {
      // Add PrismaPlugin to copy Prisma binaries into serverless bundle
      // Required for monorepo deployments on Vercel with custom Prisma output path
      if (isServer) {
        webpackConfig.plugins = [...webpackConfig.plugins, new PrismaPlugin()];
      }

      // Map React Native to React Native Web for web builds
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        "react-native$": "react-native-web",
        // Enforce a single instance of 'tamagui' at runtime to avoid
        // "Haven't called createTamagui yet" errors caused by duplicate module instances
        tamagui: require.resolve("tamagui"),
        // Explicit alias for @tamagui/polyfill-dev to fix webpack resolution in pnpm monorepo
        "@tamagui/polyfill-dev": require.resolve("@tamagui/polyfill-dev"),
        // Enforce single instance of config to prevent "Missing theme" errors from duplicate modules
        "@buttergolf/config": resolve(__dirname, "../../packages/config/src/tamagui.config.ts"),
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
