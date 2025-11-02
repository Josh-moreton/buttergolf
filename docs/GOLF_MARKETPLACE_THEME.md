# Golf Marketplace Theme Guide

## Overview

This is a polished MVP theme designed for the ButterGolf marketplace. It uses a golf-inspired color palette with green as the primary color (representing golf courses) and amber accents for premium/prestige elements.

## What is `@tamagui/themes`?

`@tamagui/themes` is **NOT** just a theme starter kit. It's a complete, production-ready theme system that includes:

- ✅ Pre-built light and dark theme definitions
- ✅ Semantic color scales (color1-12: background → foreground)
- ✅ Color palettes from Radix UI (green, blue, amber, etc.)
- ✅ Size, space, radius, and z-index tokens
- ✅ Component-specific theme variants
- ✅ Transparent color variations for overlays

**You can use it as-is or extend/customize it** - which is what we've done here.

## Theme Design

### Light Theme
- **Background**: Cream/off-white (`#fbfbf9`) - warm, inviting
- **Primary**: Golf green (`#13a063`) - represents courses and nature
- **Text**: Deep forest green (`#042918`) - excellent contrast
- **Shadows**: Subtle, professional depth

### Dark Theme
- **Background**: Deep forest (`#0a1410`) - rich, sophisticated
- **Primary**: Bright green (`#13a063` → `#1bc77f`) - pops on dark
- **Text**: Light cream (`#e5f0e0`) - easy on the eyes
- **Shadows**: More pronounced for depth

### Available Themes

1. **`light`** - Default light theme (golf green)
2. **`dark`** - Default dark theme (forest dark)
3. **`light_green`** - Explicit green variant
4. **`dark_green`** - Explicit dark green variant
5. **`light_amber`** - Amber accent (for premium features)
6. **`dark_amber`** - Dark amber accent

## Usage Examples

### Basic Component Usage

The theme automatically applies to all Tamagui components:

```tsx
import { View, Text, Button } from '@buttergolf/ui'

function ProductCard() {
  return (
    <View 
      backgroundColor="$background"    // Uses theme background
      borderColor="$borderColor"       // Theme border
      padding="$4"
      borderRadius="$4"
    >
      <Text color="$color">          {/* Theme text color */}
        Premium Golf Club Set
      </Text>
      <Button 
        backgroundColor="$color9"      {/* Primary green */}
        color="$background"
      >
        Add to Cart
      </Button>
    </View>
  )
}
```

### Using Theme Variants

Switch between theme variants for different components:

```tsx
import { Theme, Button } from '@buttergolf/ui'

function PricingSection() {
  return (
    <>
      {/* Standard products use green theme */}
      <Button theme="green">View Product</Button>
      
      {/* Premium products use amber theme */}
      <Theme name="amber">
        <Button>Premium Access</Button>
      </Theme>
    </>
  )
}
```

### Dark Mode Toggle

```tsx
import { useState } from 'react'
import { Button, Theme, View } from '@buttergolf/ui'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  return (
    <Theme name={theme}>
      <View backgroundColor="$background" flex={1}>
        <Button 
          onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
        </Button>
        {/* Your app content */}
      </View>
    </Theme>
  )
}
```

### Accessing Theme Values

```tsx
import { useTheme } from 'tamagui'

function CustomComponent() {
  const theme = useTheme()
  
  return (
    <View style={{ backgroundColor: theme.background.val }}>
      <Text style={{ color: theme.color.val }}>
        Using theme values directly
      </Text>
    </View>
  )
}
```

### Semantic Color Scale

The `color1-12` scale goes from background to foreground:

```tsx
<View>
  <View backgroundColor="$color1">Lightest</View>
  <View backgroundColor="$color3">Light</View>
  <View backgroundColor="$color6">Medium</View>
  <View backgroundColor="$color9">Brand color</View>
  <View backgroundColor="$color12">Darkest</View>
</View>
```

### Hover/Press States

Theme automatically handles interactive states:

```tsx
<Button
  backgroundColor="$color9"           // Brand green
  hoverStyle={{ backgroundColor: '$color10' }}  // Darker on hover
  pressStyle={{ backgroundColor: '$color11' }}  // Even darker on press
>
  Interactive Button
</Button>
```

## Custom Color Tokens

In addition to the theme, you still have access to your custom color tokens:

```tsx
<View backgroundColor="$green700">    {/* #0b6b3f */}
<View backgroundColor="$amber400">    {/* #f2b705 */}
<View backgroundColor="$bgCard">      {/* #F6F7FB */}
```

These are useful when you need specific brand colors outside the semantic theme scale.

## Component Examples

### Product Card

```tsx
import { Card, H3, Text, Button, YStack, XStack } from '@buttergolf/ui'

function ProductCard({ product }) {
  return (
    <Card
      backgroundColor="$backgroundStrong"
      borderColor="$borderColor"
      padding="$4"
      hoverStyle={{
        borderColor: '$borderColorHover',
        shadowColor: '$shadowColorHover',
        shadowRadius: 8,
      }}
    >
      <YStack space="$3">
        <H3 color="$color">{product.name}</H3>
        <Text color="$color11" fontSize="$5">
          ${product.price}
        </Text>
        <XStack space="$2">
          <Button flex={1} theme="green">
            View Details
          </Button>
          <Theme name="amber">
            <Button flex={1}>
              Buy Now
            </Button>
          </Theme>
        </XStack>
      </YStack>
    </Card>
  )
}
```

### Hero Section

```tsx
import { YStack, H1, Text, Button } from '@buttergolf/ui'

function HeroSection() {
  return (
    <YStack 
      backgroundColor="$color1"      // Lightest green tint
      padding="$8"
      space="$4"
      alignItems="center"
    >
      <H1 color="$color12" size="$10">
        Premium Golf Equipment
      </H1>
      <Text color="$color11" textAlign="center" maxWidth={600}>
        Discover the finest golf clubs, apparel, and accessories
      </Text>
      <Button 
        size="$6" 
        backgroundColor="$color9"
        hoverStyle={{ backgroundColor: '$color10' }}
      >
        Shop Now
      </Button>
    </YStack>
  )
}
```

## Replacing the Theme Later

When Marketing provides the final brand guidelines, simply update:

1. **Color values** in `golfMarketplaceThemes` object
2. **Keep the structure** (light/dark, color1-12 scale)
3. **Theme names** can stay the same or be updated

The beauty of using Tamagui themes is that all your components will automatically update without code changes.

## Benefits of This Approach

✅ **Professional**: Uses proven Tamagui theme patterns
✅ **Consistent**: Semantic color scales ensure harmony
✅ **Accessible**: Proper contrast ratios built in
✅ **Dark mode**: Already implemented
✅ **Flexible**: Easy to customize later
✅ **Type-safe**: Full TypeScript support

## Testing Your Theme

1. Start the dev server:
   ```bash
   pnpm dev:web    # or pnpm dev:mobile
   ```

2. Create a test page with various components
3. Toggle between light and dark modes
4. Test interactive states (hover, press)
5. Verify accessibility with contrast checkers

## Resources

- [Tamagui Themes Docs](https://tamagui.dev/docs/core/theme)
- [Color Scale Guidelines](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)
- [Tamagui Full Documentation](https://tamagui.dev/llms-full.txt)
