'use client'

import { Button, H2, Text, YStack } from '@buttergolf/ui'
import { useLink } from 'solito/navigation'
import { routes } from '../../navigation'

export function RoundsScreen() {
  const homeLink = useLink({ href: routes.home })

  return (
    <YStack flex={1} padding="$4" gap="$lg" backgroundColor="$background">
      <H2>Your Rounds</H2>
      <Text fontSize="$5">
        Welcome to Rounds! Track your golf games here.
      </Text>
      <Button {...homeLink} size="sm">
        Back to Home
      </Button>
    </YStack>
  )
}
