"use client";

import Image from "next/image";
import { Text, Row, Column } from "@buttergolf/ui";

export function FooterSection() {
  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "#F45314",
        paddingTop: "64px",
        paddingBottom: "48px",
        overflow: "hidden",
      }}
    >
      {/* Background B.svg pattern */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "50%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <Image
          src="/_assets/logo/b.svg"
          alt=""
          fill
          sizes="50vw"
          style={{
            objectFit: "contain",
          }}
        />
      </div>

      {/* Content Container */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1280px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "48px",
          paddingRight: "48px",
        }}
      >
        {/* Top Section: Logo + Navigation Links */}
        <Row
          justifyContent="space-between"
          alignItems="flex-start"
          marginBottom="$2xl"
          flexWrap="wrap"
          gap="$xl"
        >
          {/* Logo */}
          <Image
            src="/_assets/logo/logo-cream-on-white.svg"
            alt="ButterGolf"
            width={200}
            height={80}
            priority
            style={{
              height: "auto",
              width: "100%",
              maxWidth: "200px",
            }}
          />

          {/* Right Side - Navigation Links (Two Columns) */}
          <Row gap="$3xl" alignItems="flex-start" zIndex={1}>
            {/* Column 1 */}
            <Column gap="$xs" alignItems="flex-start">
              <Text
                color="$vanillaCream"
                size="$4"
                fontWeight="700"
                cursor="pointer"
                hoverStyle={{ opacity: 0.8 }}
              >
                Home
              </Text>
              <Text
                color="$vanillaCream"
                size="$4"
                fontWeight="700"
                cursor="pointer"
                hoverStyle={{ opacity: 0.8 }}
              >
                Buying
              </Text>
              <Text
                color="$vanillaCream"
                size="$4"
                fontWeight="700"
                cursor="pointer"
                hoverStyle={{ opacity: 0.8 }}
              >
                Selling
              </Text>
            </Column>

            {/* Column 2 */}
            <Column gap="$xs" alignItems="flex-start">
              <Text
                color="$vanillaCream"
                size="$4"
                cursor="pointer"
                hoverStyle={{ opacity: 0.8 }}
              >
                Blog
              </Text>
              <Text
                color="$vanillaCream"
                size="$4"
                cursor="pointer"
                hoverStyle={{ opacity: 0.8 }}
              >
                Terms of Service
              </Text>
              <Text
                color="$vanillaCream"
                size="$4"
                cursor="pointer"
                hoverStyle={{ opacity: 0.8 }}
              >
                Privacy Policy
              </Text>
              <Text
                color="$vanillaCream"
                size="$4"
                cursor="pointer"
                hoverStyle={{ opacity: 0.8 }}
              >
                Help Centre
              </Text>
            </Column>
          </Row>
        </Row>

        {/* Bottom Section: Copyright + TrustPilot */}
        <Row
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap="$md"
        >
          {/* Copyright */}
          {/* Copyright */}
                  </Row>
        <Row justifyContent="center">
          <Text color="$vanillaCream" fontSize="$3" zIndex={1}>
            © 2024 ButterGolf. All rights reserved.

          {/* TrustPilot Placeholder */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              padding: "12px 24px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#00B67A" }}>
              ★ Trustpilot
            </span>
            <span style={{ fontSize: "12px", color: "#666" }}>TrustScore 4</span>
          </div>
        </Row>
      </div>
    </div>
  );
}
