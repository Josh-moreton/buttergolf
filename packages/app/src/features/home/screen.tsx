'use client'

import { YStack, H1, Text, Button } from '@buttergolf/ui'
import { Link } from 'solito/link'
import { routes } from '../../navigation'

export function HomeScreen() {
  return (
    <YStack flex={1} ai="center" jc="center" p="$4" gap="$4" bg="$background">
      <H1 ta="center">ButterGolf ⛳</H1>
      <Text ta="center" fos="$5" col="$color">
        Track your golf rounds with ease
      </Text>
      <Link href={routes.rounds}>
        <Button size="$4" theme="blue">
          View Rounds
        </Button>
      </Link>
    </YStack>
  )
}
