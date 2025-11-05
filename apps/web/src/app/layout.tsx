import type { Metadata, Viewport } from "next";
export const dynamic = "force-dynamic";
import "./globals.css";
import { NextTamaguiProvider } from "./NextTamaguiProvider";

// Load Tamagui CSS in production (compiled output)
if (process.env.NODE_ENV === "production") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("../../public/tamagui.css");
}
import { MarketplaceHeader } from "./_components/header/MarketplaceHeader";
import { TrustBar } from "./_components/marketplace/TrustBar";
import { AppPromoBanner } from "./_components/AppPromoBanner";
import { ServiceWorkerRegistration } from "./_components/ServiceWorkerRegistration";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#13a063",
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
    <html lang="en" suppressHydrationWarning className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
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
