"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Text, Row, Column } from "@buttergolf/ui";
import { imagePaths } from "@buttergolf/assets";
import { AnimatedWelcomeLogo } from "./AnimatedWelcomeLogo";

export function HeroSectionNew() {
  // Calculate when the logo animation completes
  // 20 paths * 0.08 delay + 1.2 duration = ~2.8 seconds
  const logoAnimationDuration = 20 * 0.08 + 1.2;
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
        paddingHorizontal="$8"
        paddingVertical="$12"
        $md={{ paddingHorizontal: "$12" }}
        $lg={{ paddingHorizontal: "$20", paddingLeft: 80 }}
        gap="$6"
        zIndex={2}
        position="relative"
      >
        <Column gap="$8" maxWidth={600}>
          {/* Animated Welcome Logo */}
          <div style={{ marginBottom: "2rem" }}>
            <AnimatedWelcomeLogo />
          </div>

          {/* Subheading - Fades in after logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: logoAnimationDuration,
              ease: "easeOut",
            }}
          >
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
          </motion.div>

          {/* CTA Button - Fades in after subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: logoAnimationDuration + 0.3,
              ease: "easeOut",
            }}
          >
            <Row marginTop="$6">
              <Link href="/listings" style={{ textDecoration: "none" }}>
                <Button
                  backgroundColor="#FFF8E7"
                  color="#2C5F4F"
                  paddingHorizontal="$10"
                  paddingVertical="$5"
                  borderRadius="$md"
                  fontSize={16}
                  fontWeight="700"
                  hoverStyle={{
                    backgroundColor: "#FFF0D1",
                    scale: 1.03,
                  }}
                  pressStyle={{
                    backgroundColor: "#FFE8BB",
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
          </motion.div>
        </Column>
      </Column>
    </Row>
  );
}
