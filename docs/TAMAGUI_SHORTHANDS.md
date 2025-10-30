# Tamagui Shorthands Guide

This document explains the Tamagui shorthand props that are now fully supported in ButterGolf.

## What Are Shorthands?

Tamagui shorthands are abbreviated prop names that make your code more concise and easier to read. For example, instead of writing `justifyContent="center"`, you can write `jc="center"`.

## Configuration

The project now uses the correct TypeScript configuration to enable Tamagui shorthands:

- Each package has a `types.d.ts` file that declares module augmentation
- The UI package exports everything from `tamagui` directly
- TypeScript uses `moduleResolution: "Bundler"` for proper type resolution

## Available Shorthands

### Layout Shorthands

| Shorthand | Full Property | Example |
|-----------|---------------|---------|
| `f` | `flex` | `f={1}` |
| `fd` | `flexDirection` | `fd="row"` |
| `fw` | `flexWrap` | `fw="wrap"` |
| `ai` | `alignItems` | `ai="center"` |
| `ac` | `alignContent` | `ac="center"` |
| `jc` | `justifyContent` | `jc="space-between"` |
| `as` | `alignSelf` | `as="flex-start"` |
| `fg` | `flexGrow` | `fg={1}` |
| `fs` | `flexShrink` | `fs={0}` |
| `fb` | `flexBasis` | `fb="auto"` |

### Spacing Shorthands

| Shorthand | Full Property | Example |
|-----------|---------------|---------|
| `m` | `margin` | `m="$4"` |
| `mt` | `marginTop` | `mt="$2"` |
| `mr` | `marginRight` | `mr="$3"` |
| `mb` | `marginBottom` | `mb="$4"` |
| `ml` | `marginLeft` | `ml="$2"` |
| `mx` | `marginHorizontal` | `mx="$3"` |
| `my` | `marginVertical` | `my="$4"` |
| `p` | `padding` | `p="$4"` |
| `pt` | `paddingTop` | `pt="$2"` |
| `pr` | `paddingRight` | `pr="$3"` |
| `pb` | `paddingBottom` | `pb="$4"` |
| `pl` | `paddingLeft` | `pl="$2"` |
| `px` | `paddingHorizontal` | `px="$3"` |
| `py` | `paddingVertical` | `py="$4"` |

### Size Shorthands

| Shorthand | Full Property | Example |
|-----------|---------------|---------|
| `w` | `width` | `w="100%"` |
| `h` | `height` | `h={200}` |
| `maw` | `maxWidth` | `maw={500}` |
| `mah` | `maxHeight` | `mah={300}` |
| `miw` | `minWidth` | `miw={100}` |
| `mih` | `minHeight` | `mih={50}` |

### Color & Background Shorthands

| Shorthand | Full Property | Example |
|-----------|---------------|---------|
| `bg` | `backgroundColor` | `bg="$background"` |
| `bc` | `borderColor` | `bc="$borderColor"` |
| `col` | `color` | `col="$color"` |

### Border Shorthands

| Shorthand | Full Property | Example |
|-----------|---------------|---------|
| `br` | `borderRadius` | `br="$4"` |
| `btlr` | `borderTopLeftRadius` | `btlr="$2"` |
| `btrr` | `borderTopRightRadius` | `btrr="$2"` |
| `bblr` | `borderBottomLeftRadius` | `bblr="$2"` |
| `bbrr` | `borderBottomRightRadius` | `bbrr="$2"` |
| `bw` | `borderWidth` | `bw={1}` |
| `btw` | `borderTopWidth` | `btw={2}` |
| `brw` | `borderRightWidth` | `brw={1}` |
| `bbw` | `borderBottomWidth` | `bbw={2}` |
| `blw` | `borderLeftWidth` | `blw={1}` |

### Text Shorthands

| Shorthand | Full Property | Example |
|-----------|---------------|---------|
| `ta` | `textAlign` | `ta="center"` |
| `fow` | `fontWeight` | `fow="bold"` |
| `fos` | `fontSize` | `fos="$5"` |
| `lh` | `lineHeight` | `lh={1.5}` |
| `ls` | `letterSpacing` | `ls={0.5}` |
| `tt` | `textTransform` | `tt="uppercase"` |

### Position Shorthands

| Shorthand | Full Property | Example |
|-----------|---------------|---------|
| `pos` | `position` | `pos="absolute"` |
| `t` | `top` | `t={0}` |
| `r` | `right` | `r={0}` |
| `b` | `bottom` | `b={0}` |
| `l` | `left` | `l={0}` |
| `zi` | `zIndex` | `zi={10}` |

### Display & Opacity Shorthands

| Shorthand | Full Property | Example |
|-----------|---------------|---------|
| `dsp` | `display` | `dsp="flex"` |
| `o` | `opacity` | `o={0.5}` |
| `ov` | `overflow` | `ov="hidden"` |

## Usage Examples

### Basic Layout
```tsx
<YStack
  f={1}
  jc="center"
  ai="center"
  p="$4"
  gap="$4"
  bg="$background"
>
  <Text>Centered content with padding</Text>
</YStack>
```

### Card Component
```tsx
<YStack
  w="100%"
  maw={400}
  p="$4"
  br="$4"
  bg="$backgroundHover"
  bw={1}
  bc="$borderColor"
>
  <Text>Card content</Text>
</YStack>
```

### Responsive Layout
```tsx
<XStack
  fw="wrap"
  jc="space-between"
  ai="center"
  gap="$3"
  p="$4"
>
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</XStack>
```

### Absolute Positioning
```tsx
<YStack pos="relative">
  <View pos="absolute" t={10} r={10} zi={10}>
    <Badge />
  </View>
  <Text>Main content</Text>
</YStack>
```

## Using Tokens

Tamagui shorthands work seamlessly with design tokens (prefixed with `$`):

```tsx
<YStack
  p="$4"        // Uses spacing token
  br="$4"       // Uses radius token
  bg="$blue10"  // Uses color token
  gap="$3"      // Uses spacing token
>
  <Text col="$color">Themed text</Text>
</YStack>
```

## Benefits

1. **Concise Code**: Write less, achieve more
2. **Better Readability**: Shorter props are easier to scan
3. **Type Safety**: Full TypeScript support with autocomplete
4. **Consistent**: Works across all Tamagui components
5. **Performance**: Shorthands are optimized by Tamagui's compiler

## Test Component

See `packages/app/src/features/test/screen.tsx` for a working example demonstrating various shorthands in action.

## Resources

- [Tamagui Shorthands Documentation](https://tamagui.dev/docs/core/configuration#shorthands)
- [Tamagui Core Concepts](https://tamagui.dev/docs/intro/introduction)
- [Full Tamagui Documentation](https://tamagui.dev/llms-full.txt)
