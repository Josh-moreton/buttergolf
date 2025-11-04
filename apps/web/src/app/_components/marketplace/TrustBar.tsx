"use client";

import Link from "next/link";
import { Row, Text } from "@buttergolf/ui";

export function TrustBar() {
  return (
    <Row
      backgroundColor="$primaryLight"
      borderBottomWidth={1}
      borderColor="$border"
      paddingVertical="$sm"
      paddingHorizontal="$md"
      justifyContent="center"
      alignItems="center"
      flexWrap="wrap"
      gap="$2"
      {...{
        style: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 },
      }}
    >
      <Row
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
        gap="$xs"
      >
        <Text size="sm" weight="medium">
          Give 10%, Get 10%.
        </Text>
        <Link href="/refer-a-friend" style={{ textDecoration: "none" }}>
          <Text
            size="sm"
            weight="medium"
            textDecorationLine="underline"
            cursor="pointer"
            hoverStyle={{ opacity: 0.7 }}
          >
            Refer a friend.
          </Text>
        </Link>
      </Row>
    </Row>
  );
}
