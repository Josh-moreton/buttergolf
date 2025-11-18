"use client";

import { Row, Text } from "@buttergolf/ui";
import { Heart } from "@tamagui/lucide-icons";

interface FavoritesFilterProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function FavoritesFilter({ enabled, onChange }: FavoritesFilterProps) {
  return (
    <Row
      gap="$sm"
      alignItems="center"
      paddingVertical="$sm"
      paddingHorizontal="$md"
      backgroundColor={enabled ? "$primaryLight" : "transparent"}
      borderRadius="$md"
      borderWidth={1}
      borderColor={enabled ? "$primary" : "$border"}
      cursor="pointer"
      hoverStyle={{
        backgroundColor: enabled ? "$primaryLight" : "$backgroundHover",
      }}
      onPress={() => onChange(!enabled)}
    >
      <Heart
        size={20}
        color={enabled ? "#F45314" : "#545454"}
        fill={enabled ? "#F45314" : "none"}
      />
      <Text
        fontSize="$4"
        color={enabled ? "$primary" : "$textSecondary"}
        weight={enabled ? "semibold" : "normal"}
      >
        Favorites Only
      </Text>
    </Row>
  );
}
