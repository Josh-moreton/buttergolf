# Component Visual Guide

Quick reference guide for all ButterGolf UI components with visual examples.

## 🎨 Color Palette

### Brand Colors
```
Primary (Green)
■ $green50   #e6f7f0  ■ $green100  #b3e5d1  ■ $green200  #80d3b2
■ $green300  #4dc193  ■ $green400  #26b77f  ■ $green500  #13a063 (PRIMARY)
■ $green600  #0f8c54  ■ $green700  #0b6b3f  ■ $green800  #084f2e
■ $green900  #053320

Secondary (Amber/Gold)
■ $amber50   #fef9e6  ■ $amber100  #fceeb3  ■ $amber200  #fae380
■ $amber300  #f8d84d  ■ $amber400  #f2b705 (SECONDARY) ■ $amber500  #d99f04
■ $amber600  #b38403  ■ $amber700  #8c6802  ■ $amber800  #664c02
■ $amber900  #403001
```

### Semantic Colors
```
Success (Teal)        Info (Blue)           Error (Red)
■ $teal500  #02aaa4   ■ $blue500  #3c50e0   ■ $red600  #dc2626
```

---

## 🔘 Buttons

### Sizes
```tsx
<Button size="sm">Small</Button>    // height: 32px
<Button size="md">Medium</Button>   // height: 40px
<Button size="lg">Large</Button>    // height: 48px
```

### Tones
```tsx
// Primary (Green background, white text)
<Button tone="primary">Primary</Button>

// Secondary (Amber background, dark text)
<Button tone="secondary">Secondary</Button>

// Outline (Transparent background, green border)
<Button tone="outline">Outline</Button>

// Ghost (Transparent, text color)
<Button tone="ghost">Ghost</Button>

// Success (Teal background)
<Button tone="success">Success</Button>

// Error (Red background)
<Button tone="error">Error</Button>
```

### States
```tsx
<Button disabled>Disabled</Button>
<Button loading>Loading...</Button>
<Button fullWidth>Full Width</Button>
```

---

## 📝 Typography

### Text Sizes
```tsx
<Text size="xs">Extra Small (12px)</Text>
<Text size="sm">Small (14px)</Text>
<Text size="md">Medium (16px)</Text>
<Text size="lg">Large (18px)</Text>
<Text size="xl">Extra Large (20px)</Text>
```

### Text Colors
```tsx
<Text color="default">Default Text</Text>
<Text color="secondary">Secondary Text</Text>
<Text color="tertiary">Tertiary Text</Text>
<Text color="muted">Muted Text</Text>
<Text color="primary">Primary Color</Text>
<Text color="error">Error Color</Text>
<Text color="success">Success Color</Text>
<Text color="warning">Warning Color</Text>
```

### Text Weights
```tsx
<Text weight="normal">Normal (400)</Text>
<Text weight="medium">Medium (500)</Text>
<Text weight="semibold">Semibold (600)</Text>
<Text weight="bold">Bold (700)</Text>
```

### Headings
```tsx
<Heading level={1}>Heading 1</Heading>  // 48px
<Heading level={2}>Heading 2</Heading>  // 36px
<Heading level={3}>Heading 3</Heading>  // 30px
<Heading level={4}>Heading 4</Heading>  // 24px
<Heading level={5}>Heading 5</Heading>  // 20px
<Heading level={6}>Heading 6</Heading>  // 18px
```

---

## 📦 Cards

### Variants
```tsx
// Elevated (with shadow)
<Card variant="elevated">
  <Card.Header>Header</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Footer</Card.Footer>
</Card>

// Outlined (with border)
<Card variant="outlined">...</Card>

// Filled (background color)
<Card variant="filled">...</Card>

// Ghost (transparent)
<Card variant="ghost">...</Card>
```

### Padding Options
```tsx
<Card padding="none">No padding</Card>
<Card padding="sm">Small padding</Card>
<Card padding="md">Medium padding</Card>
<Card padding="lg">Large padding</Card>
```

---

## 📥 Inputs

### Sizes
```tsx
<Input size="sm" placeholder="Small" />    // height: 32px
<Input size="md" placeholder="Medium" />   // height: 40px
<Input size="lg" placeholder="Large" />    // height: 48px
```

### States
```tsx
// Normal
<Input placeholder="Enter text" />

// Error
<Input error placeholder="Has error" />

// Success
<Input success placeholder="Valid input" />

// Disabled
<Input disabled value="Disabled" />

// Full width
<Input fullWidth placeholder="Full width" />
```

---

## 🏷️ Badges

### Variants (3 sizes each)
```tsx
// Status badges
<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="neutral">Neutral</Badge>
<Badge variant="outline">Outline</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>

// Dot indicator
<Badge variant="success" dot />
```

---

## 🔄 Spinner

```tsx
<Spinner size="sm" />     // 16px
<Spinner size="md" />     // 20px
<Spinner size="lg" />     // 24px

<Spinner color="$primary" />
<Spinner color="$success" />
```

---

## 📐 Layout Components

### Row (Horizontal)
```tsx
<Row gap="md" align="center" justify="between">
  <Text>Left</Text>
  <Button>Right</Button>
</Row>

// Gap options: xs, sm, md, lg, xl
// Align: start, center, end, stretch, baseline
// Justify: start, center, end, between, around, evenly
```

### Column (Vertical)
```tsx
<Column gap="lg" align="stretch">
  <Heading level={2}>Title</Heading>
  <Text>Content</Text>
  <Button>Action</Button>
</Column>

// Gap options: xs, sm, md, lg, xl
// Align: start, center, end, stretch
// Justify: start, center, end, between, around, evenly
```

### Container
```tsx
<Container maxWidth="lg" padding="md">
  {/* Constrained width content */}
</Container>

// Max widths: sm (640), md (768), lg (1024), xl (1280), 2xl (1536)
// Padding: none, xs, sm, md, lg, xl
```

### Spacer
```tsx
<Row>
  <Text>Left</Text>
  <Spacer flex />  {/* Takes remaining space */}
  <Text>Right</Text>
</Row>

<Column>
  <Text>Item 1</Text>
  <Spacer size="md" />  {/* 16px gap */}
  <Text>Item 2</Text>
</Column>

// Sizes: xs, sm, md, lg, xl
```

---

## 🎭 Complete Examples

### Form Example
```tsx
<Column gap="lg" fullWidth>
  {/* Email field */}
  <Column gap="xs">
    <Row gap="xs">
      <Label htmlFor="email">Email</Label>
      <Text color="error">*</Text>
    </Row>
    <Input
      id="email"
      type="email"
      size="md"
      placeholder="your@email.com"
      error={!!emailError}
      fullWidth
    />
    {emailError && (
      <Text size="sm" color="error">{emailError}</Text>
    )}
  </Column>

  {/* Password field */}
  <Column gap="xs">
    <Label htmlFor="password">Password</Label>
    <Input
      id="password"
      type="password"
      size="md"
      placeholder="••••••••"
      fullWidth
    />
  </Column>

  {/* Submit button */}
  <Button size="lg" tone="primary" fullWidth>
    Sign In
  </Button>
</Column>
```

### Product Card Example
```tsx
<Card variant="elevated" padding="none" fullWidth>
  <Card.Header padding="none">
    <Image
      source={{ uri: product.imageUrl }}
      width="100%"
      height={200}
      borderTopLeftRadius="$lg"
      borderTopRightRadius="$lg"
    />
  </Card.Header>
  
  <Card.Body padding="lg">
    <Column gap="sm">
      <Heading level={4}>{product.name}</Heading>
      <Text color="secondary">{product.category}</Text>
      <Row align="center" justify="between">
        <Text size="xl" weight="bold">
          ${product.price}
        </Text>
        <Badge variant="success">In Stock</Badge>
      </Row>
    </Column>
  </Card.Body>
  
  <Card.Footer align="right">
    <Button tone="outline" size="md">
      Add to Cart
    </Button>
  </Card.Footer>
</Card>
```

### Dashboard Stats Example
```tsx
<Row gap="lg" wrap>
  {/* Stat card 1 */}
  <Card variant="filled" padding="lg" flex={1}>
    <Column gap="sm">
      <Row align="center" gap="sm">
        <Badge variant="success" dot />
        <Text color="secondary">Active Users</Text>
      </Row>
      <Heading level={2}>1,234</Heading>
      <Text size="sm" color="success">+12% from last month</Text>
    </Column>
  </Card>

  {/* Stat card 2 */}
  <Card variant="filled" padding="lg" flex={1}>
    <Column gap="sm">
      <Row align="center" gap="sm">
        <Badge variant="info" dot />
        <Text color="secondary">Revenue</Text>
      </Row>
      <Heading level={2}>$45.2K</Heading>
      <Text size="sm" color="info">+8% from last month</Text>
    </Column>
  </Card>

  {/* Stat card 3 */}
  <Card variant="filled" padding="lg" flex={1}>
    <Column gap="sm">
      <Row align="center" gap="sm">
        <Badge variant="warning" dot />
        <Text color="secondary">Pending</Text>
      </Row>
      <Heading level={2}>23</Heading>
      <Text size="sm" color="warning">Needs attention</Text>
    </Column>
  </Card>
</Row>
```

### Loading State Example
```tsx
<Card variant="elevated" padding="lg">
  <Column gap="md" align="center">
    <Spinner size="lg" color="$primary" />
    <Text color="secondary">Loading content...</Text>
  </Column>
</Card>
```

### Alert Example
```tsx
<Card variant="outlined" padding="md">
  <Row gap="md" align="start">
    <Badge variant="error" size="sm" />
    <Column gap="xs" flex={1}>
      <Text weight="semibold">Error</Text>
      <Text color="secondary">
        Something went wrong. Please try again.
      </Text>
    </Column>
    <Button tone="ghost" size="sm">
      Dismiss
    </Button>
  </Row>
</Card>
```

---

## 📱 Responsive Design

### Mobile First
```tsx
<Container maxWidth="lg">
  <Column
    gap="md"
    $gtMd={{ gap: "lg" }}  // Larger gap on desktop
  >
    <Row
      flexDirection="column"
      $gtSm={{ flexDirection: "row" }}  // Horizontal on tablet+
      gap="md"
    >
      <Column flex={1}>Content 1</Column>
      <Column flex={1}>Content 2</Column>
    </Row>
  </Column>
</Container>
```

### Breakpoints
```
$xs:     max-width 660px
$gtXs:   min-width 661px
$sm:     max-width 860px
$gtSm:   min-width 861px
$md:     max-width 1020px
$gtMd:   min-width 1021px
$lg:     max-width 1280px
$gtLg:   min-width 1281px
```

---

## 🎨 Theme Usage

### Light/Dark Theme
```tsx
import { Theme } from '@buttergolf/ui'

function App() {
  return (
    <>
      {/* Light theme content */}
      <Theme name="light">
        <View backgroundColor="$background">
          <Text color="$text">Light theme</Text>
        </View>
      </Theme>

      {/* Dark theme content */}
      <Theme name="dark">
        <View backgroundColor="$background">
          <Text color="$text">Dark theme</Text>
        </View>
      </Theme>
    </>
  )
}
```

---

## 🔍 Quick Reference

### Component Sizes
```
Buttons:  sm=32px, md=40px, lg=48px
Inputs:   sm=32px, md=40px, lg=48px
Text:     xs=12px, sm=14px, md=16px, lg=18px, xl=20px
Badges:   sm=20px, md=24px, lg=28px
Spinners: sm=16px, md=20px, lg=24px
```

### Common Patterns
```tsx
// Full-width form field
<Column gap="xs" fullWidth>
  <Label>Field Name</Label>
  <Input fullWidth />
</Column>

// Action row
<Row justify="end" gap="md">
  <Button tone="ghost">Cancel</Button>
  <Button tone="primary">Submit</Button>
</Row>

// Status indicator
<Row align="center" gap="xs">
  <Badge variant="success" dot />
  <Text>Active</Text>
</Row>

// Card with action
<Card variant="elevated">
  <Card.Body>Content</Card.Body>
  <Card.Footer align="right">
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

---

For complete documentation, see:
- `packages/ui/README.md` - Full component API reference
- `packages/config/README.md` - Token system guide
- `DESIGN_SYSTEM_SUMMARY.md` - Implementation overview
