"use client";

import Link from "next/link";
import { Button, Text, Row, Column } from "@buttergolf/ui";
import { imagePaths } from "@buttergolf/assets";
import { AnimatedWelcomeLogo } from "./AnimatedWelcomeLogo";

export function HeroSectionNew() {
  return (
    <Row width="100%" minHeight="100vh" position="relative" overflow="hidden">
      {/* Background Image - Full Width */}
      <img
        src={imagePaths.hero.golfCourse}
        alt="Golf course background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          zIndex: 0,
        }}
      />

      {/* Content Container */}
      <Column
        flex={1}
        justifyContent="center"
        paddingHorizontal="$6"
        paddingVertical="$12"
        $md={{ paddingHorizontal: "$10" }}
        $lg={{ paddingHorizontal: "$16", paddingLeft: "$20" }}
        gap="$6"
        zIndex={2}
        position="relative"
      >
        <Column gap="$4" maxWidth={600}>
          {/* Animated Welcome Logo */}
          <div style={{ marginBottom: "1rem" }}>
            <AnimatedWelcomeLogo />
          </div>

          {/* Subheading */}
          <Text
            fontSize={18}
            $md={{ fontSize: 20 }}
            $lg={{ fontSize: 22 }}
            lineHeight={1.6}
            weight="normal"
            {...{
              style: {
                color: "rgba(255, 248, 231, 0.95)",
                maxWidth: "500px",
              },
            }}
          >
            Pre-loved golf clubs, straight from the course.
          </Text>

          {/* CTA Button */}
          <Row marginTop="$4">
            <Link href="/listings" style={{ textDecoration: "none" }}>
              <Button
                backgroundColor="#2C5F4F"
                color="#FFF8E7"
                paddingHorizontal="$10"
                paddingVertical="$5"
                borderRadius="$md"
                fontSize={16}
                fontWeight="700"
                hoverStyle={{
                  backgroundColor: "#234A3D",
                  scale: 1.03,
                }}
                pressStyle={{
                  backgroundColor: "#1A3A2E",
                  scale: 0.98,
                }}
                {...{
                  style: {
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                  },
                }}
              >
                Shop Now
              </Button>
            </Link>
          </Row>
        </Column>
      </Column>
    </Row>
  );
}
