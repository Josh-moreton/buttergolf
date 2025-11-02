/**
 * Theme Showcase Component
 * 
 * A demo component to showcase the Golf Marketplace theme.
 * Use this to test theme colors, variants, and dark mode.
 */

import { Button, Card, H2, H3, Paragraph, Separator, Theme, XStack, YStack } from 'tamagui'

export function ThemeShowcase() {
  return (
    <YStack space="$6" padding="$4" backgroundColor="$background">
      <YStack space="$3">
        <H2 color="$color">Golf Marketplace Theme</H2>
        <Paragraph color="$color11">
          A polished MVP theme with golf-inspired colors and professional styling.
        </Paragraph>
      </YStack>

      <Separator borderColor="$borderColor" />

      {/* Color Scale Demo */}
      <YStack space="$3">
        <H3 color="$color">Color Scale (1-12)</H3>
        <XStack space="$2" flexWrap="wrap">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
            <Card
              key={num}
              backgroundColor={`$color${num}` as any}
              padding="$3"
              minWidth={80}
              alignItems="center"
            >
              <Paragraph 
                color={num > 6 ? '$color1' : '$color12'} 
                fontSize="$2"
              >
                color{num}
              </Paragraph>
            </Card>
          ))}
        </XStack>
      </YStack>

      <Separator borderColor="$borderColor" />

      {/* Button Variants */}
      <YStack space="$3">
        <H3 color="$color">Button Styles</H3>
        <XStack space="$2" flexWrap="wrap">
          <Button backgroundColor="$color9">Primary</Button>
          <Button backgroundColor="$color7">Secondary</Button>
          <Button backgroundColor="$color11">Dark</Button>
          <Button borderWidth={1} borderColor="$borderColor" backgroundColor="transparent">
            Outline
          </Button>
        </XStack>
      </YStack>

      <Separator borderColor="$borderColor" />

      {/* Theme Variants */}
      <YStack space="$3">
        <H3 color="$color">Theme Variants</H3>
        <XStack space="$3" flexWrap="wrap">
          <Theme name="green">
            <Card padding="$4" space="$2" backgroundColor="$backgroundStrong">
              <Paragraph color="$color" fontWeight="bold">Green Theme</Paragraph>
              <Button backgroundColor="$color9">Action</Button>
            </Card>
          </Theme>
          
          <Theme name="amber">
            <Card padding="$4" space="$2" backgroundColor="$backgroundStrong">
              <Paragraph color="$color" fontWeight="bold">Amber Theme</Paragraph>
              <Button backgroundColor="$color9">Premium</Button>
            </Card>
          </Theme>
        </XStack>
      </YStack>

      <Separator borderColor="$borderColor" />

      {/* Interactive States */}
      <YStack space="$3">
        <H3 color="$color">Interactive States</H3>
        <Button
          backgroundColor="$color9"
          hoverStyle={{
            backgroundColor: '$color10',
            borderColor: '$borderColorHover',
          }}
          pressStyle={{
            backgroundColor: '$color11',
            scale: 0.98,
          }}
          focusStyle={{
            borderColor: '$borderColorFocus',
            borderWidth: 2,
          }}
        >
          Hover, Press, Focus Me
        </Button>
      </YStack>

      <Separator borderColor="$borderColor" />

      {/* Card Example */}
      <YStack space="$3">
        <H3 color="$color">Product Card Example</H3>
        <Card
          backgroundColor="$backgroundStrong"
          borderColor="$borderColor"
          padding="$4"
          maxWidth={400}
          hoverStyle={{
            borderColor: '$borderColorHover',
            shadowColor: '$shadowColorHover',
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <YStack space="$3">
            <H3 color="$color">Premium Golf Club Set</H3>
            <Paragraph color="$color11">
              Professional-grade titanium driver, fairway woods, and irons.
            </Paragraph>
            <XStack space="$2" justifyContent="space-between" alignItems="center">
              <Paragraph color="$color" fontSize="$8" fontWeight="bold">
                $1,299
              </Paragraph>
              <XStack space="$2">
                <Button flex={1}>Details</Button>
                <Theme name="amber">
                  <Button flex={1}>Buy Now</Button>
                </Theme>
              </XStack>
            </XStack>
          </YStack>
        </Card>
      </YStack>
    </YStack>
  )
}
