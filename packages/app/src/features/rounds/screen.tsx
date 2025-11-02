'use client'

import { Button, H2, Text, YStack } from '@buttergolf/ui'
import { useLink } from 'solito/navigation'
import { routes } from '../../navigation'

export function RoundsScreen() {
  const homeLink = useLink({ href: routes.home })

  return (
    <YStack flex={1} padding="$4" {...{ gap: "lg" as any }} backgroundColor="$background">
      <H2>Your Rounds</H2>
      <Text size="md">
        Round tracking coming soon! This will connect to your Prisma database.
      </Text>
      <Button {...homeLink} size="$3">
        Back to Home
      </Button>
    </YStack>
  )
}
