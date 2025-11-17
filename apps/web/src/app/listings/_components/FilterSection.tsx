"use client";

import { Column, Text, Row } from "@buttergolf/ui";
import { useState } from "react";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function FilterSection({
  title,
  children,
  defaultExpanded = true,
}: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Column gap="$sm" width="100%">
      <Row
        alignItems="center"
        justifyContent="space-between"
        paddingVertical="$xs"
        cursor="pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Text weight="semibold" size="$3">
          {title}
        </Text>
        <Text color="$textSecondary" size="$3">
          {isExpanded ? "−" : "+"}
        </Text>
      </Row>
      {isExpanded && <Column gap="$sm">{children}</Column>}
    </Column>
  );
}
