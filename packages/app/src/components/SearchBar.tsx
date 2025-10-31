'use client'

import { Input, XStack, Button } from '@buttergolf/ui'
import { Search } from '@tamagui/lucide-icons'

export interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
}

export function SearchBar({
  placeholder = 'Search for golf equipment...',
  onSearch,
}: SearchBarProps) {
  return (
    <XStack
      width="100%"
      maxWidth={600}
      gap="$2"
      alignItems="center"
    >
      <Input
        flex={1}
        size="$4"
        placeholder={placeholder}
        borderRadius="$10"
        paddingLeft="$4"
        backgroundColor="$background"
      />
      <Button
        size="$4"
        icon={Search}
        borderRadius="$10"
        theme="blue"
        onPress={() => onSearch?.('')}
      >
        Search
      </Button>
    </XStack>
  )
}
