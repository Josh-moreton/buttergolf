'use client'

import { YStack, H2, Text, Button } from '@buttergolf/ui'
import { Link } from 'solito/link'
import { routes } from '../../navigation'

export function RoundsScreen() {
  return (
    <YStack flex={1} p="$4" gap="$4" bg="$background">
      <H2>Your Rounds</H2>
      <Text fos="$4" col="$color">
        Round tracking coming soon! This will connect to your Prisma database.
      </Text>
      <Link href={routes.home}>
        <Button size="$3">
          Back to Home
        </Button>
      </Link>
    </YStack>
  )
}
