"use client";

import { Column, Text as TamaguiText } from "@buttergolf/ui";

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
      <Column
        width="100%"
        height={100}
        borderRadius="$xl"
        overflow="hidden"
        position="relative"
        alignItems="center"
        justifyContent="center"
        padding="$4"
        $gtMd={{
          height: 150,
          padding: "$6",
        }}
        $gtLg={{
          height: 180,
          padding: "$8",
        }}
      >
        {/* Background image with 70% opacity */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/_assets/images/butter-background.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.7,
            zIndex: 0,
          }}
        />
        <TamaguiText
          fontWeight="700"
          style={{ fontSize: "clamp(24px, 4vw, 40px)", position: "relative", zIndex: 1 }}
          lineHeight={1.2}
          color="$primary"
          textAlign="center"
        >
          Discover your buttery swing
        </TamaguiText>
      </Column>
    </Column>
  );
}
