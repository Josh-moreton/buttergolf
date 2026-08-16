"use client";

import { Button, Column, Heading, Text } from "@buttergolf/ui";
import { useLink } from "solito/navigation";
import { routes } from "../../navigation";

export function RoundsScreen() {
  const homeLink = useLink({ href: routes.home });

  return (
    <Column flex={1} padding="$4" gap="$lg" backgroundColor="$background">
      <Heading level={2}>Your Rounds</Heading>
      <Text size="$5">Welcome to Rounds! Track your golf games here.</Text>
      <Button {...homeLink} size="$3">
        Back to Home
      </Button>
    </Column>
  );
}
