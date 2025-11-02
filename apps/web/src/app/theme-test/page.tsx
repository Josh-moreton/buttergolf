'use client'

import { useState } from 'react'
import { Button, Theme, Row, Column, H1, Paragraph, Text, Card } from '@buttergolf/ui'

export default function ThemeTestPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <Theme name={theme}>
      <Column backgroundColor="$background" minHeight="100vh" padding="$4">
        {/* Theme Toggle Header */}
        <Row 
          {...{ justify: "between" as any }} 
          align="center" 
          padding="$4"
          backgroundColor="$surface"
          borderRadius="$4"
          marginBottom="$4"
          borderWidth={1}
          borderColor="$border"
        >
          <Column>
            <H1 {...{ color: "$text" as any }} fontSize="$8">Theme Testing</H1>
            <Paragraph {...{ color: "$textSecondary" as any }}>
              Current theme: <strong>{theme}</strong>
            </Paragraph>
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
        <Column {...{ gap: "lg" as any }}>
          <Card>
            <Column {...{ gap: "sm" as any }} padding="$4">
              <Text size="lg" weight="bold">Semantic Colors</Text>
              
              <Row {...{ gap: "sm" as any }} wrap={true}>
                <Column {...{ gap: "xs" as any }} padding="$3" backgroundColor="$primary" borderRadius="$4" minWidth={120}>
                  <Text {...{ color: "inverse" as any }} weight="semibold">Primary</Text>
                  <Text {...{ color: "inverse" as any }} size="xs">Brand Color</Text>
                </Column>
                
                <Column {...{ gap: "xs" as any }} padding="$3" backgroundColor="$secondary" borderRadius="$4" minWidth={120}>
                  <Text weight="semibold">Secondary</Text>
                  <Text size="xs">Accent Color</Text>
                </Column>
                
                <Column {...{ gap: "xs" as any }} padding="$3" backgroundColor="$info" borderRadius="$4" minWidth={120}>
                  <Text {...{ color: "inverse" as any }} weight="semibold">Info</Text>
                  <Text {...{ color: "inverse" as any }} size="xs">Information</Text>
                </Column>
                
                <Column {...{ gap: "xs" as any }} padding="$3" backgroundColor="$success" borderRadius="$4" minWidth={120}>
                  <Text {...{ color: "inverse" as any }} weight="semibold">Success</Text>
                  <Text {...{ color: "inverse" as any }} size="xs">Positive State</Text>
                </Column>
                
                <Column {...{ gap: "xs" as any }} padding="$3" backgroundColor="$warning" borderRadius="$4" minWidth={120}>
                  <Text weight="semibold">Warning</Text>
                  <Text size="xs">Caution State</Text>
                </Column>
                
                <Column {...{ gap: "xs" as any }} padding="$3" backgroundColor="$error" borderRadius="$4" minWidth={120}>
                  <Text {...{ color: "inverse" as any }} weight="semibold">Error</Text>
                  <Text {...{ color: "inverse" as any }} size="xs">Error State</Text>
                </Column>
              </Row>
            </Column>
          </Card>

          <Card>
            <Column {...{ gap: "sm" as any }} padding="$4">
              <Text size="lg" weight="bold">Text Colors</Text>
              <Text {...{ color: "default" as any }} size="md">Default Text Color</Text>
              <Text {...{ color: "secondary" as any }} size="md">Secondary Text Color</Text>
              <Text {...{ color: "tertiary" as any }} size="md">Tertiary Text Color</Text>
              <Text {...{ color: "muted" as any }} size="md">Muted Text Color</Text>
              <Column backgroundColor="$text" padding="$3" borderRadius="$4">
                <Text {...{ color: "inverse" as any }} size="md">Inverse Text Color</Text>
              </Column>
            </Column>
          </Card>

          <Card>
            <Column {...{ gap: "sm" as any }} padding="$4">
              <Text size="lg" weight="bold">Surface & Border Colors</Text>
              <Column {...{ gap: "xs" as any }}>
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
