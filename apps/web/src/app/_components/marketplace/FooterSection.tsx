"use client";

import { Text, Row, Column, Heading, useMedia } from "@buttergolf/ui";

export function FooterSection() {
  const media = useMedia();

  return (
    <Column
      paddingVertical="$2xl"
      paddingHorizontal="$md"
      borderTopWidth={1}
      borderColor="$border"
      backgroundColor="$surface"
    >
      <Column maxWidth={1200} marginHorizontal="auto" width="100%" gap="$2xl">
        {/* Main Footer Content */}
        <Row
          gap="$xl"
          justifyContent="flex-start"
          alignItems="flex-start"
          flexWrap={media.md || media.lg || media.xl ? "nowrap" : "wrap"}
        >
          {/* Brand Section */}
          <Column flex={1.2} minWidth={220} maxWidth={280}>
            <img
              src="/logo-white.png"
              alt="ButterGolf"
              style={{ height: "80px", width: "auto", maxWidth: "100%", objectFit: "contain" }}
            />
          </Column>

          {/* Marketplace Section */}
          <Column flex={1} minWidth={160} gap="$md">
            <Text weight="semibold" size="md">
              Marketplace
            </Text>
            <Column gap="$sm">
              <Text
                {...{ color: "$textSecondary" }}
                size="sm"
                hoverStyle={{ color: "$primary", cursor: "pointer" }}
              >
                Browse Equipment
              </Text>
              <Text
                {...{ color: "$textSecondary" }}
                size="sm"
                hoverStyle={{ color: "$primary", cursor: "pointer" }}
              >
                Sell Your Gear
              </Text>
              <Text
                {...{ color: "$textSecondary" }}
                size="sm"
                hoverStyle={{ color: "$primary", cursor: "pointer" }}
              >
                How It Works
              </Text>
              <Text
                {...{ color: "$textSecondary" }}
                size="sm"
                hoverStyle={{ color: "$primary", cursor: "pointer" }}
              >
                Pricing Guide
              </Text>
            </Column>
          </Column>

          {/* Support Section */}
          <Column flex={1} minWidth={160} gap="$md">
            <Text weight="semibold" size="md">
              Support
            </Text>
            <Column gap="$sm">
              <Text
                {...{ color: "$textSecondary" }}
                size="sm"
                hoverStyle={{ color: "$primary", cursor: "pointer" }}
              >
                Help Center
              </Text>
              <Text
                {...{ color: "$textSecondary" }}
                size="sm"
                hoverStyle={{ color: "$primary", cursor: "pointer" }}
              >
                Buyer Protection
              </Text>
              <Text
                {...{ color: "$textSecondary" }}
                size="sm"
                hoverStyle={{ color: "$primary", cursor: "pointer" }}
              >
                Safety Guidelines
              </Text>
              <Text
                {...{ color: "$textSecondary" }}
                size="sm"
                hoverStyle={{ color: "$primary", cursor: "pointer" }}
              >
                Contact Us
              </Text>
            </Column>
          </Column>

          {/* Company Section */}
          <Column flex={1} minWidth={160} gap="$md">
            <Text weight="semibold" size="md">
              Company
            </Text>
            <Column gap="$sm">
              <Text
                {...{ color: "$textSecondary" }}
                size="sm"
                hoverStyle={{ color: "$primary", cursor: "pointer" }}
              >
                About Us
              </Text>
              <Text
                {...{ color: "$textSecondary" }}
                size="sm"
                hoverStyle={{ color: "$primary", cursor: "pointer" }}
              >
                Careers
              </Text>
              <Text
                {...{ color: "$textSecondary" }}
                size="sm"
                hoverStyle={{ color: "$primary", cursor: "pointer" }}
              >
                Press & Media
              </Text>
              <Text
                {...{ color: "$textSecondary" }}
                size="sm"
                hoverStyle={{ color: "$primary", cursor: "pointer" }}
              >
                Partnerships
              </Text>
            </Column>
          </Column>

          {/* Legal Section */}
          <Column flex={1} minWidth={160} gap="$md">
            <Text weight="semibold" size="md">
              Legal
            </Text>
            <Column gap="$sm">
              <Text
                {...{ color: "$textSecondary" }}
                size="sm"
                hoverStyle={{ color: "$primary", cursor: "pointer" }}
              >
                Terms of Service
              </Text>
              <Text
                {...{ color: "$textSecondary" }}
                size="sm"
                hoverStyle={{ color: "$primary", cursor: "pointer" }}
              >
                Privacy Policy
              </Text>
              <Text
                {...{ color: "$textSecondary" }}
                size="sm"
                hoverStyle={{ color: "$primary", cursor: "pointer" }}
              >
                Cookie Policy
              </Text>
              <Text
                {...{ color: "$textSecondary" }}
                size="sm"
                hoverStyle={{ color: "$primary", cursor: "pointer" }}
              >
                Dispute Resolution
              </Text>
            </Column>
          </Column>
        </Row>

        {/* Divider */}
        <Column height={1} backgroundColor="$border" />

        {/* Bottom Bar */}
        <Row
          justifyContent="space-between"
          alignItems="center"
          gap="$md"
          flexWrap="wrap"
        >
          <Text {...{ color: "$textTertiary" }} size="sm">
            © {new Date().getFullYear().toString()} ButterGolf. All rights
            reserved.
          </Text>

          <Row gap="$lg">
            <Text
              {...{ color: "$textTertiary" }}
              size="sm"
              hoverStyle={{ color: "$primary", cursor: "pointer" }}
            >
              Twitter
            </Text>
            <Text
              {...{ color: "$textTertiary" }}
              size="sm"
              hoverStyle={{ color: "$primary", cursor: "pointer" }}
            >
              Instagram
            </Text>
            <Text
              {...{ color: "$textTertiary" }}
              size="sm"
              hoverStyle={{ color: "$primary", cursor: "pointer" }}
            >
              Facebook
            </Text>
            <Text
              {...{ color: "$textTertiary" }}
              size="sm"
              hoverStyle={{ color: "$primary", cursor: "pointer" }}
            >
              LinkedIn
            </Text>
          </Row>
        </Row>
      </Column>
    </Column>
  );
}
