'use client'

import { Button, H1, Text, YStack } from '@buttergolf/ui'
import { useLink } from 'solito/navigation'
import { routes } from '../../navigation'

export function HomeScreen() {
  const roundsLink = useLink({ href: routes.rounds })

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="$4"
      gap="$4"
      backgroundColor="$background"
    >
      <H1 textAlign="center">ButterGolf ⛳</H1>
      <Text textAlign="center" fontSize="$5" color="$color">
        Track your golf rounds with ease
      </Text>
      <Button {...roundsLink} size="$4" theme="blue">
        View Rounds
      </Button>
    </YStack>
  )
}
