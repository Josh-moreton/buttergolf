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
}: Readonly<SearchBarProps>) {
  return (
    <XStack
      width="100%"
      maxWidth={600}
      {...{ gap: "xs" as any }}
      alignItems="center"
    >
      <Input
        flex={1}
        size="$4"
        placeholder={placeholder}
        borderRadius="$10"
        paddingLeft="$4"
        backgroundColor="$surface"
        borderColor="$border"
        color="$text"
        placeholderTextColor="$textMuted"
        focusStyle={{
          borderColor: '$borderFocus',
          borderWidth: 2,
        }}
      />
      <Button
        size="$4"
        icon={Search}
        borderRadius="$10"
        backgroundColor="$primary"
        color="$textInverse"
        hoverStyle={{ backgroundColor: '$primaryHover' }}
        pressStyle={{ backgroundColor: '$primaryPress' }}
        onPress={() => onSearch?.('')}
      >
        Search
      </Button>
    </XStack>
  )
}
