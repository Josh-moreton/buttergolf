# Layout Component Migration Guide

Quick reference for migrating from raw Tamagui primitives to semantic layout components.

## Quick Reference

### Layout Components

| Old (XStack/YStack)            | New (Row/Column)            | Notes             |
| ------------------------------ | --------------------------- | ----------------- |
| `<XStack>`                     | `<Row>`                     | Horizontal layout |
| `<YStack>`                     | `<Column>`                  | Vertical layout   |
| `maxWidth={1024} width="100%"` | `<Container maxWidth="lg">` | Max-width wrapper |
| `<View flex={1} />`            | `<Spacer />`                | Flexible space    |

### Gap Sizes

| Old        | New        | Pixels |
| ---------- | ---------- | ------ |
| `gap="$2"` | `gap="xs"` | 4px    |
| `gap="$3"` | `gap="sm"` | 8px    |
| `gap="$4"` | `gap="md"` | 16px   |
| `gap="$5"` | `gap="lg"` | 24px   |
| `gap="$6"` | `gap="xl"` | 32px   |

### Alignment

| Old                              | New                 |
| -------------------------------- | ------------------- |
| `alignItems="center"`            | `align="center"`    |
| `alignItems="flex-start"`        | `align="start"`     |
| `justifyContent="space-between"` | `justify="between"` |
| `flexWrap="wrap"`                | `wrap`              |

### Text Colors

| Old                      | New                 |
| ------------------------ | ------------------- |
| `color="$text"`          | `color="default"`   |
| `color="$textSecondary"` | `color="secondary"` |
| `color="$textMuted"`     | `color="muted"`     |
| `color="$textInverse"`   | `color="inverse"`   |

## Migration Examples

### Example 1: Basic Row

```typescript
// BEFORE
<XStack gap="$4" alignItems="center">
  <Text>Label</Text>
  <Button>Action</Button>
</XStack>

// AFTER
<Row gap="md" align="center">
  <Text>Label</Text>
  <Button>Action</Button>
</Row>
```

### Example 2: Justified Row

```typescript
// BEFORE
<XStack justifyContent="space-between" alignItems="center" width="100%">
  <Text>Left</Text>
  <Button>Right</Button>
</XStack>

// AFTER
<Row justify="between" align="center" fullWidth>
  <Text>Left</Text>
  <Button>Right</Button>
</Row>
```

### Example 3: Column with Gap

```typescript
// BEFORE
<YStack gap="$6">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  <Text>Item 3</Text>
</YStack>

// AFTER
<Column gap="xl">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  <Text>Item 3</Text>
</Column>
```

### Example 4: Container with Max Width

```typescript
// BEFORE
<YStack maxWidth={1024} width="100%" marginHorizontal="auto" paddingHorizontal="$4">
  <Text>Constrained content</Text>
</YStack>

// AFTER
<Container maxWidth="lg" padding="md">
  <Text>Constrained content</Text>
</Container>
```

### Example 5: Spacer for Flexible Space

```typescript
// BEFORE
<XStack>
  <Text>Left</Text>
  <View flex={1} />
  <Button>Right</Button>
</XStack>

// AFTER
<Row>
  <Text>Left</Text>
  <Spacer />
  <Button>Right</Button>
</Row>
```

### Example 6: Card Compound Components

```typescript
// BEFORE
import { Card } from '@buttergolf/ui'
const CardHeader = (Card as any).Header
const CardFooter = (Card as any).Footer

<Card>
  <CardHeader {...{ padding: "md" as any }}>
    <Text>Header</Text>
  </CardHeader>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// AFTER
import { Card } from '@buttergolf/ui'

<Card>
  <Card.Header padding="md">
    <Text>Header</Text>
  </Card.Header>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

### Example 7: Text Colors

```typescript
// BEFORE
<Text color="$textMuted">Helper text</Text>
<Text {...{ color: "muted" as any }}>Helper text</Text>

// AFTER
<Text color="muted">Helper text</Text>
```

### Example 8: Headings

```typescript
// BEFORE
import { H1, H2 } from '@buttergolf/ui'
<H1 color="$text">Title</H1>
<H2 color="$textSecondary">Subtitle</H2>

// AFTER
import { Heading } from '@buttergolf/ui'
<Heading level={1}>Title</Heading>
<Heading level={2} color="secondary">Subtitle</Heading>
```

### Example 9: Form Layout

```typescript
// BEFORE
<YStack gap="$4">
  <YStack gap="$2">
    <Text>Email</Text>
    <Input />
  </YStack>
  <XStack gap="$3" justifyContent="flex-end">
    <Button>Cancel</Button>
    <Button>Submit</Button>
  </XStack>
</YStack>

// AFTER
<Column gap="md">
  <Column gap="xs">
    <Text>Email</Text>
    <Input />
  </Column>
  <Row gap="sm" justify="end">
    <Button>Cancel</Button>
    <Button>Submit</Button>
  </Row>
</Column>
```

### Example 10: Responsive Grid

```typescript
// BEFORE
<XStack flexWrap="wrap" gap="$4" justifyContent="flex-start">
  {items.map(item => <Card key={item.id}>{item.content}</Card>)}
</XStack>

// AFTER
<Row wrap gap="md" justify="start">
  {items.map(item => <Card key={item.id}>{item.content}</Card>)}
</Row>
```

## Container Sizes

```typescript
<Container maxWidth="sm">   {/* 640px */}
<Container maxWidth="md">   {/* 768px */}
<Container maxWidth="lg">   {/* 1024px - default */}
<Container maxWidth="xl">   {/* 1280px */}
<Container maxWidth="2xl">  {/* 1536px */}
<Container maxWidth="full"> {/* 100% */}
```

## Gap Sizes Reference

```typescript
<Row gap="xs">  {/* 4px */}
<Row gap="sm">  {/* 8px */}
<Row gap="md">  {/* 16px - most common */}
<Row gap="lg">  {/* 24px */}
<Row gap="xl">  {/* 32px */}
<Row gap="2xl"> {/* 48px */}
```

## Alignment Reference

### Horizontal (Row)

```typescript
<Row align="start">     {/* top */}
<Row align="center">    {/* middle */}
<Row align="end">       {/* bottom */}
<Row align="stretch">   {/* full height */}
<Row align="baseline">  {/* text baseline */}
```

### Vertical (Column)

```typescript
<Column align="start">   {/* left */}
<Column align="center">  {/* center */}
<Column align="end">     {/* right */}
<Column align="stretch"> {/* full width */}
```

## Justify Reference

```typescript
<Row justify="start">   {/* left */}
<Row justify="center">  {/* center */}
<Row justify="end">     {/* right */}
<Row justify="between"> {/* space-between */}
<Row justify="around">  {/* space-around */}
<Row justify="evenly">  {/* space-evenly */}
```

## Common Patterns

### Header with Actions

```typescript
<Row justify="between" align="center" fullWidth>
  <Heading level={2}>Page Title</Heading>
  <Button>Action</Button>
</Row>
```

### Form Field with Label

```typescript
<Column gap="xs" fullWidth>
  <Row gap="xs">
    <Text weight="semibold">Email</Text>
    <Text color="error">*</Text>
  </Row>
  <Input fullWidth />
</Column>
```

### Card Grid

```typescript
<Row gap="lg" wrap fullWidth>
  {items.map(item => (
    <Card key={item.id} style={{ minWidth: 280, flex: 1 }}>
      {item.content}
    </Card>
  ))}
</Row>
```

### Centered Content

```typescript
<Container maxWidth="md" center>
  <Column gap="lg" align="center">
    <Heading level={1}>Welcome</Heading>
    <Text align="center">Description text</Text>
    <Button>Get Started</Button>
  </Column>
</Container>
```

### Split Layout

```typescript
<Row gap="lg" fullWidth>
  <Column flex={1} gap="md">
    <Text>Left content</Text>
  </Column>
  <Column flex={1} gap="md">
    <Text>Right content</Text>
  </Column>
</Row>
```

## Tips

1. **Start with semantic names**: Use `gap="md"` instead of `gap="$4"`
2. **Use variants**: Prefer `<Row gap="lg">` over `<Row style={{ gap: 24 }}>`
3. **Consistent spacing**: Stick to the semantic scale (xs, sm, md, lg, xl)
4. **Container for max-width**: Use `<Container>` instead of manual max-width
5. **Spacer for push**: Use `<Spacer />` to push content apart
6. **Type safety**: No `as any` needed with new components

## See Also

- [Layout Audit Report](./LAYOUT_AUDIT_REPORT.md) - Full audit findings
- [Layout Harness Page](../apps/web/src/app/layout-harness/page.tsx) - Live examples
- [Copilot Instructions](../.github/copilot-instructions.md) - Design system docs
