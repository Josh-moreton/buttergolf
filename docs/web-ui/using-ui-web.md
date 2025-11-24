# Using @buttergolf/ui-web

This guide explains how to use the new web-only UI components in the Next.js application.

## Quick Start

```tsx
import { Button, Text, Card, Input, Badge } from "@buttergolf/ui-web";

function MyComponent() {
  return (
    <Card variant="elevated">
      <Card.Header>
        <Heading level={3}>Welcome</Heading>
      </Card.Header>
      <Card.Body>
        <Text>Enter your details below</Text>
        <Input placeholder="Email" />
      </Card.Body>
      <Card.Footer>
        <Button variant="primary">Submit</Button>
      </Card.Footer>
    </Card>
  );
}
```

## When to Use ui-web vs Tamagui

| Use `@buttergolf/ui-web` | Use `@buttergolf/ui` (Tamagui) |
|--------------------------|-------------------------------|
| New web-only pages | Cross-platform screens in `packages/app` |
| Server Components | Mobile app screens |
| Pages that don't need React Native compatibility | Shared screens that run on both web and mobile |

**Recommendation**: For all **new** web pages, use `@buttergolf/ui-web`. The Tamagui components remain for cross-platform screens and mobile.

## Component Reference

### Button

```tsx
import { Button } from "@buttergolf/ui-web";

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>
<Button fullWidth>Full Width</Button>

// With icons
<Button icon={<PlusIcon />}>Add Item</Button>
<Button iconAfter={<ArrowRightIcon />}>Continue</Button>
```

### Text

```tsx
import { Text, Heading, Label } from "@buttergolf/ui-web";

// Text sizes
<Text size="xs">Extra small</Text>
<Text size="sm">Small</Text>
<Text size="base">Base (default)</Text>
<Text size="md">Medium</Text>
<Text size="lg">Large</Text>
<Text size="xl">Extra large</Text>
<Text size="2xl">2X Large</Text>

// Text weights
<Text weight="normal">Normal</Text>
<Text weight="medium">Medium</Text>
<Text weight="semibold">Semibold</Text>
<Text weight="bold">Bold</Text>

// Text colors
<Text color="default">Default</Text>
<Text color="secondary">Secondary</Text>
<Text color="muted">Muted</Text>
<Text color="primary">Primary</Text>
<Text color="error">Error</Text>
<Text color="success">Success</Text>

// Text alignment
<Text align="left">Left</Text>
<Text align="center">Center</Text>
<Text align="right">Right</Text>

// Truncation
<Text truncate>This very long text will be truncated...</Text>

// Render as different elements
<Text as="span">Inline text</Text>
<Text as="div">Block text</Text>
```

### Heading

```tsx
import { Heading } from "@buttergolf/ui-web";

// Levels (1-6)
<Heading level={1}>Page Title (48px)</Heading>
<Heading level={2}>Section Title (40px)</Heading>
<Heading level={3}>Subsection (32px)</Heading>
<Heading level={4}>Card Title (28px)</Heading>
<Heading level={5}>Small Heading (24px)</Heading>
<Heading level={6}>Tiny Heading (20px)</Heading>

// Weight override
<Heading level={2} weight="extrabold">Bold Heading</Heading>

// Color
<Heading level={2} color="primary">Branded Title</Heading>
```

### Input

```tsx
import { Input, Textarea, Label } from "@buttergolf/ui-web";

// Basic usage
<Label htmlFor="email">Email</Label>
<Input id="email" placeholder="you@example.com" />

// Sizes
<Input size="sm" placeholder="Small" />
<Input size="md" placeholder="Medium" />
<Input size="lg" placeholder="Large" />

// States
<Input error helperText="This field is required" />
<Input success helperText="Looks good!" />
<Input disabled value="Cannot edit" />

// With icons
<Input
  startIcon={<SearchIcon />}
  placeholder="Search..."
/>
<Input
  endIcon={<CheckIcon />}
  placeholder="Validated"
/>

// Textarea
<Textarea placeholder="Enter description..." />
<Textarea error helperText="Too short" />
```

### Card

```tsx
import { Card } from "@buttergolf/ui-web";

// Variants
<Card variant="elevated">Shadow</Card>
<Card variant="outlined">Border</Card>
<Card variant="filled">Subtle bg</Card>
<Card variant="ghost">Transparent</Card>

// Padding
<Card padding="none">No padding</Card>
<Card padding="sm">Small padding</Card>
<Card padding="md">Medium padding</Card>
<Card padding="lg">Large padding</Card>

// Interactive (clickable)
<Card variant="outlined" interactive onClick={handleClick}>
  Click me
</Card>

// Full width
<Card fullWidth>Spans container</Card>

// Compound components
<Card variant="elevated">
  <Card.Header>
    <Heading level={4}>Title</Heading>
  </Card.Header>
  <Card.Body>
    <Text>Content goes here</Text>
  </Card.Body>
  <Card.Footer align="right">
    <Button size="sm">Action</Button>
  </Card.Footer>
</Card>

// Without borders on header/footer
<Card>
  <Card.Header noBorder>
    <Heading level={4}>Clean Header</Heading>
  </Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer noBorder align="center">
    <Button variant="ghost">Close</Button>
  </Card.Footer>
</Card>
```

### Badge

```tsx
import { Badge } from "@buttergolf/ui-web";

// Variants
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
<Badge variant="success" dot /> Online
<Badge variant="error" dot /> Offline
```

### Layout Components

```tsx
import { Row, Column, Container, Spacer, Divider } from "@buttergolf/ui-web";

// Row (horizontal)
<Row gap="md" align="center" justify="between">
  <Text>Left</Text>
  <Text>Right</Text>
</Row>

// Column (vertical)
<Column gap="lg" align="stretch">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</Column>

// Container (max-width wrapper)
<Container size="lg" padding="md" centered>
  <Text>Constrained content</Text>
</Container>

// Spacer (flexible space)
<Row>
  <Text>Left</Text>
  <Spacer />
  <Text>Right (pushed)</Text>
</Row>

// Fixed-size spacer
<Column>
  <Text>Above</Text>
  <Spacer size="lg" />
  <Text>Below</Text>
</Column>

// Divider
<Column gap="md">
  <Text>Section 1</Text>
  <Divider />
  <Text>Section 2</Text>
</Column>

// Subtle divider
<Divider variant="subtle" />

// Vertical divider
<Row>
  <Text>Left</Text>
  <Divider orientation="vertical" />
  <Text>Right</Text>
</Row>
```

### Spinner

```tsx
import { Spinner } from "@buttergolf/ui-web";

// Sizes
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size="xl" />

// Colors
<Spinner color="primary" />
<Spinner color="secondary" />
<Spinner color="white" />  // For dark backgrounds
<Spinner color="current" /> // Inherits text color
```

## Styling with Custom Classes

All components accept a `className` prop for custom styling:

```tsx
<Button className="shadow-lg hover:scale-105">
  Custom Button
</Button>

<Card className="border-2 border-primary">
  Custom Card
</Card>
```

## Using with Tailwind Classes

The components work seamlessly with Tailwind utilities:

```tsx
<div className="grid grid-cols-3 gap-4">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</div>

<Button className="mt-4 w-full md:w-auto">
  Responsive Button
</Button>
```

## Server Components

All ui-web components are compatible with React Server Components. No `"use client"` directive is needed unless you add interactivity:

```tsx
// app/page.tsx - Server Component
import { Card, Text, Heading } from "@buttergolf/ui-web";

export default function Page() {
  return (
    <Card>
      <Heading level={1}>Server Rendered</Heading>
      <Text>This works in RSC!</Text>
    </Card>
  );
}
```

For interactive components, add `"use client"`:

```tsx
// app/form.tsx - Client Component
"use client";

import { Button, Input } from "@buttergolf/ui-web";
import { useState } from "react";

export function Form() {
  const [value, setValue] = useState("");

  return (
    <>
      <Input value={value} onChange={e => setValue(e.target.value)} />
      <Button onClick={() => alert(value)}>Submit</Button>
    </>
  );
}
```

## Demo Page

Visit `/ui-test` in the web app to see all components in action:

```
http://localhost:3000/ui-test
```

## Migration from Tamagui

When migrating existing pages from Tamagui to ui-web:

| Tamagui | ui-web |
|---------|--------|
| `<Button size="$4">` | `<Button size="md">` |
| `<Text size="$5">` | `<Text size="md">` |
| `<XStack gap="$md">` | `<Row gap="md">` |
| `<YStack gap="$lg">` | `<Column gap="lg">` |
| `backgroundColor="$primary"` | `className="bg-primary"` or use Button variant |
| `<Card variant="elevated">` | `<Card variant="elevated">` (same!) |
| `<Badge variant="success">` | `<Badge variant="success">` (same!) |

Most component APIs are intentionally similar to ease migration.
