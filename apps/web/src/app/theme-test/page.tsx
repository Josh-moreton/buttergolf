'use client'

import { useState } from 'react'
import { Button, Theme, YStack, XStack, H1, Paragraph } from '@buttergolf/ui'
import { ThemeShowcase } from '@buttergolf/ui'

export default function ThemeTestPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <Theme name={theme}>
      <YStack backgroundColor="$background" minHeight="100vh" padding="$4">
        {/* Theme Toggle Header */}
        <XStack 
          justifyContent="space-between" 
          alignItems="center" 
          padding="$4"
          backgroundColor="$backgroundStrong"
          borderRadius="$4"
          marginBottom="$4"
          borderWidth={1}
          borderColor="$borderColor"
        >
          <YStack>
            <H1 color="$color" fontSize="$8">Theme Testing</H1>
            <Paragraph color="$color11">
              Current theme: <strong>{theme}</strong>
            </Paragraph>
          </YStack>
          <Button
            backgroundColor="$color9"
            onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            size="$4"
          >
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
        </XStack>

        {/* Theme Showcase Component */}
        <ThemeShowcase />
      </YStack>
    </Theme>
  )
}
