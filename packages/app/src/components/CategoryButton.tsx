"use client";

import { Button, Text } from "@buttergolf/ui";

export interface CategoryButtonProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function CategoryButton({
  label,
  active = false,
  onPress,
}: Readonly<CategoryButtonProps>) {
  return (
    <Button
      variant={active ? "solid" : "outline"}
      size="sm"
      onPress={onPress}
    >
      <Text
        color={active ? "#FFFFFF" : undefined}
        fontWeight={active ? "600" : "400"}
      >
        {label}
      </Text>
    </Button>
  );
}
