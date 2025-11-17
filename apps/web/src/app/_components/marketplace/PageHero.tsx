"use client";

import { Column } from "@buttergolf/ui";
import { imagePaths } from "@buttergolf/assets";

/**
 * Smaller hero section for non-homepage pages
 * Features:
 * - Compact height (responsive: 150px mobile, 200px tablet, 250px desktop)
 * - Single line heading with Spiced Clementine color
 * - Same background image and styling as main hero
 * - Rounded corners matching design system
 */
export function PageHero() {
  return (
    <Column
      width="100%"
      paddingHorizontal="$md"
      paddingTop="$md"
      backgroundColor="$surface"
    >
      <div
        style={{
          width: "100%",
          height: "100px",
          borderRadius: "24px",
          overflow: "hidden",
          backgroundImage: `url(${imagePaths.hero.background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-urbanist)",
            fontWeight: 700,
            fontSize: "clamp(24px, 4vw, 40px)",
            lineHeight: 1.2,
            color: "#F45314",
            margin: 0,
            textAlign: "center",
          }}
        >
          Swing Smarter. Shop Better.
        </h1>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          div {
            height: 150px !important;
            padding: 24px !important;
          }
        }
        @media (min-width: 1024px) {
          div {
            height: 180px !important;
            padding: 32px !important;
          }
        }
      `}</style>
    </Column>
  );
}
