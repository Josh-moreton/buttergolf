"use client";

import { Column, Text, Heading, Button } from "@buttergolf/ui";

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <html lang="en">
      <body>
        <Column
          padding="$2xl"
          maxWidth={600}
          marginHorizontal="auto"
          marginVertical={0}
          gap="$lg"
        >
          <Heading level={2} size="$8" color="$text">
            Something went wrong!
          </Heading>

          <Text size="$5" color="$textSecondary">
            {error?.message || "An unexpected error occurred"}
          </Text>

          <Button
            onPress={() => reset()}
            size="$5"
            backgroundColor="$primary"
            color="$textInverse"
            paddingHorizontal="$2xl"
            paddingVertical="$md"
            borderRadius="$full"
            cursor="pointer"
          >
            Try again
          </Button>
        </Column>
      </body>
    </html>
  );
}
