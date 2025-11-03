"use client"

import { Text, Row, Column } from "@buttergolf/ui"

export function FooterSection() {
  return (
    <Column paddingVertical="$8" borderTopWidth={1} borderColor="$border">
      <Column maxWidth={1200} marginHorizontal="auto" paddingHorizontal="$4" gap="$xl">
        <Row gap="$$2xl" $sm={{ flexDirection: "column" }} $md={{ flexDirection: "row" }}>
          <Column flex={1} gap="$xs">
            <Text weight="bold" fontWeight="800">ButterGolf</Text>
            <Text>Peer‑to‑peer marketplace for golf gear.</Text>
          </Column>
          <Column flex={1} gap="$xs">
            <Text weight="bold">Help</Text>
            <Text>Support</Text>
            <Text>Safety</Text>
          </Column>
          <Column flex={1} gap="$xs">
            <Text weight="bold">Company</Text>
            <Text>About</Text>
            <Text>Contact</Text>
          </Column>
        </Row>
        <Text opacity={0.7}>© {new Date().getFullYear()} ButterGolf</Text>
      </Column>
    </Column>
  )
}
