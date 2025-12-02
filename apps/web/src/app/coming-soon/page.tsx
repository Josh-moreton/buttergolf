import type { Metadata } from "next";
import { AnimatedLogo } from "./_components/AnimatedLogo";

export const metadata: Metadata = {
  title: "Coming Soon | ButterGolf",
  description:
    "ButterGolf is launching soon. The smoothest way to buy and sell pre-loved golf equipment.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ComingSoonPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#F45314", // Spiced Clementine - $primary
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      {/* Animated Logo */}
      <div style={{ marginBottom: "48px" }}>
        <AnimatedLogo />
      </div>

      {/* Coming Soon Text */}
      <h1
        style={{
          fontFamily:
            'Urbanist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: "clamp(32px, 8vw, 64px)",
          fontWeight: 700,
          color: "#FFFAD2", // Vanilla Cream
          textAlign: "center",
          margin: 0,
          marginBottom: "16px",
          letterSpacing: "-0.02em",
        }}
      >
        Coming Soon
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontFamily:
            'Urbanist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: "clamp(16px, 4vw, 24px)",
          fontWeight: 400,
          color: "rgba(255, 250, 210, 0.85)", // Vanilla Cream with opacity
          textAlign: "center",
          margin: 0,
          maxWidth: "500px",
          lineHeight: 1.5,
        }}
      >
        The smoothest way to buy and sell pre-loved golf equipment.
      </p>
    </main>
  );
}
