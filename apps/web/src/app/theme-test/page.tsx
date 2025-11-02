'use client'

import { useState } from 'react'
import { Button, Theme, Row, Column, Heading, Text, Card } from '@buttergolf/ui'

export default function ThemeTestPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <Theme name={theme}>
      <Column backgroundColor="$background" minHeight="100vh" padding="$4">
        {/* Theme Toggle Header */}
        <Row 
          justify="between"
          align="center" 
          padding="$4"
          backgroundColor="$surface"
          borderRadius="$4"
          marginBottom="$4"
          borderWidth={1}
          borderColor="$border"
        >
          <Column>
            <Heading level={1}>Theme Testing</Heading>
            <Text color="secondary">
              Current theme: <strong>{theme}</strong>
            </Text>
          </Column>
          <Button
            backgroundColor="$primary"
            onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            size="$4"
          >
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
        </Row>

        {/* Theme Color Showcase */}
        <Column gap="lg">
          <Card>
            <Column gap="sm" padding="$4">
              <Text size="lg" weight="bold">Semantic Colors</Text>
              
              <Row gap="sm" wrap>
                <Column gap="xs" padding="$3" backgroundColor="$primary" borderRadius="$4" minWidth={120}>
                  <Text color="inverse" weight="semibold">Primary</Text>
                  <Text color="inverse" size="xs">Brand Color</Text>
                </Column>
                
                <Column gap="xs" padding="$3" backgroundColor="$secondary" borderRadius="$4" minWidth={120}>
                  <Text weight="semibold">Secondary</Text>
                  <Text size="xs">Accent Color</Text>
                </Column>
                
                <Column gap="xs" padding="$3" backgroundColor="$info" borderRadius="$4" minWidth={120}>
                  <Text color="inverse" weight="semibold">Info</Text>
                  <Text color="inverse" size="xs">Information</Text>
                </Column>
                
                <Column gap="xs" padding="$3" backgroundColor="$success" borderRadius="$4" minWidth={120}>
                  <Text color="inverse" weight="semibold">Success</Text>
                  <Text color="inverse" size="xs">Positive State</Text>
                </Column>
                
                <Column gap="xs" padding="$3" backgroundColor="$warning" borderRadius="$4" minWidth={120}>
                  <Text weight="semibold">Warning</Text>
                  <Text size="xs">Caution State</Text>
                </Column>
                
                <Column gap="xs" padding="$3" backgroundColor="$error" borderRadius="$4" minWidth={120}>
                  <Text color="inverse" weight="semibold">Error</Text>
                  <Text color="inverse" size="xs">Error State</Text>
                </Column>
              </Row>
            </Column>
          </Card>

          <Card>
            <Column gap="sm" padding="$4">
              <Text size="lg" weight="bold">Text Colors</Text>
              <Text color="default" size="md">Default Text Color</Text>
              <Text color="secondary" size="md">Secondary Text Color</Text>
              <Text color="tertiary" size="md">Tertiary Text Color</Text>
              <Text color="muted" size="md">Muted Text Color</Text>
              <Column backgroundColor="$text" padding="$3" borderRadius="$4">
                <Text color="inverse" size="md">Inverse Text Color</Text>
              </Column>
            </Column>
          </Card>

          <Card>
            <Column gap="sm" padding="$4">
              <Text size="lg" weight="bold">Surface & Border Colors</Text>
              <Column gap="xs">
                <Column padding="$3" backgroundColor="$background" borderRadius="$4" borderWidth={1} borderColor="$border">
                  <Text>Background with Border</Text>
                </Column>
                <Column padding="$3" backgroundColor="$surface" borderRadius="$4" borderWidth={1} borderColor="$border">
                  <Text>Surface with Border</Text>
                </Column>
                <Column padding="$3" backgroundColor="$card" borderRadius="$4" borderWidth={1} borderColor="$border">
                  <Text>Card Background with Border</Text>
                </Column>
              </Column>
            </Column>
          </Card>
        </Column>
      </Column>
    </Theme>
  )
}
