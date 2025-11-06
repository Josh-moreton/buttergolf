import type { Metadata, Viewport } from "next";
export const dynamic = "force-dynamic";
import "./globals.css";
import { NextTamaguiProvider } from "./NextTamaguiProvider";
import localFont from "next/font/local";

// Load Tamagui CSS in production (compiled output)
if (process.env.NODE_ENV === "production") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("../../public/tamagui.css");
}
import { MarketplaceHeader } from "./_components/header/MarketplaceHeader";
import { TrustBar } from "./_components/marketplace/TrustBar";
import { AppPromoBanner } from "./_components/AppPromoBanner";
import { ServiceWorkerRegistration } from "./_components/ServiceWorkerRegistration";

// Gotham font configuration for Pure Butter brand
const gotham = localFont({
  src: [
    {
      path: "../../../../packages/assets/fonts/Gotham-font-family/Gotham/Gotham-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../../../packages/assets/fonts/Gotham-font-family/Gotham/Gotham-XLight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../../../packages/assets/fonts/Gotham-font-family/Gotham/Gotham-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../../packages/assets/fonts/Gotham-font-family/Gotham/Gotham-Book.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../../packages/assets/fonts/Gotham-font-family/Gotham/Gotham-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../../packages/assets/fonts/Gotham-font-family/Gotham/Gotham-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../../packages/assets/fonts/Gotham-font-family/Gotham/Gotham-Black.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../../../packages/assets/fonts/Gotham-font-family/Gotham/Gotham-Ultra.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-gotham",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#E25F2F", // Pure Butter orange
};

export const metadata: Metadata = {
  title: "ButterGolf",
  description: "P2P Marketplace for Golf Equipment",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ButterGolf",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "ButterGolf",
    title: "ButterGolf - P2P Golf Equipment Marketplace",
    description: "Buy and sell golf equipment with fellow golfers",
  },
  other: {
    "apple-itunes-app": "app-id=YOUR_APP_ID", // TODO: Replace with actual App Store ID when available
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`light ${gotham.variable}`}
    >
      <body className={gotham.className}>
        <NextTamaguiProvider>
          <ServiceWorkerRegistration />
          <TrustBar />
          <MarketplaceHeader />
          <AppPromoBanner />
          {children}
        </NextTamaguiProvider>
      </body>
    </html>
  );
}

// Note: Solito navigation works automatically with Next.js App Router
// The Link component from 'solito/link' wraps Next.js Link for cross-platform compatibility
