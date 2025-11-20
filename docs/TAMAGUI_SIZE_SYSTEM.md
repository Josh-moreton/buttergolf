# Tamagui Size System - Complete Guide

## Overview

This document explains how sizing works in our Tamagui-based design system. Understanding the difference between **font size tokens** and **component size variants** is critical to avoid "no size" errors and write maintainable code.

## The Core Concept: Two Different "Sizes"

### 1. Font Size Tokens (Numeric: `$1` - `$16`)

**What they are:**
- Numeric tokens defined in the Tamagui font configuration
- Used to control `fontSize` and `lineHeight` on text components
- Standard scale inherited from `@tamagui/config/v4`

**Where they're defined:**
- `packages/config/src/tamagui.config.ts`
- `bodyFont.size` and `headingFont.size` objects

**How to use them:**
```tsx
// ✅ CORRECT - Use fontSize prop with numeric tokens
<Text fontSize="$4">Body text (14px)</Text>
<Text fontSize="$5">Larger text (15px)</Text>
<Text fontSize="$3">Small text (13px)</Text>

// ✅ CORRECT - Heading uses numeric tokens internally via level prop
<Heading level={2}>Uses $9 internally</Heading>
<Heading level={3}>Uses $8 internally</Heading>

// ❌ WRONG - Don't use size prop on Text
<Text size="md">Won't work!</Text>
<Text size="$4">Won't work!</Text>
```

**Font Size Scale:**

| Token | Body Font | Heading Font | Typical Use |
|-------|-----------|--------------|-------------|
| `$1`  | 11px      | 12px         | Legal text, tiny labels |
| `$2`  | 12px      | 14px         | Captions, metadata |
| `$3`  | 13px      | 16px         | Small labels, helper text |
| `$4`  | 14px      | 18px         | Body small |
| `$5`  | **15px**  | **20px**     | **Default body text** |
| `$6`  | 16px      | 24px         | Large body text |
| `$7`  | 18px      | 28px         | Subheadings |
| `$8`  | 20px      | 32px         | Large subheadings |
| `$9`  | 22px      | 40px         | Small headings (h3) |
| `$10` | 24px      | 48px         | Medium headings (h2) |
| `$11` | 28px      | 56px         | Large headings (h1) |
| `$12` | 32px      | 64px         | XL headings |
| `$13` | 40px      | 72px         | Hero text |
| `$14` | 48px      | 80px         | Display text |
| `$15` | 56px      | 96px         | Display XL |
| `$16` | 64px      | 112px        | Display XXL |

### 2. Component Size Variants (Named: `sm` | `md` | `lg`)

**What they are:**
- Named variants defined per-component in styled definitions
- Used to control geometric dimensions (height, padding, width)
- Custom to each component - not universal tokens

**Where they're defined:**
- Individual component files in `packages/ui/src/components/`
- Example: `Button.tsx`, `Input.tsx`, `Badge.tsx`, `Spinner.tsx`

**How to use them:**
```tsx
// ✅ CORRECT - Use size variant on UI components
<Button size="md" tone="primary">Click me</Button>
<Input size="lg" placeholder="Enter text" />
<Badge size="sm" variant="success">3</Badge>
<Spinner size="lg" />

// ❌ WRONG - Don't use component variants on Text
<Text size="md">Won't work!</Text>

// ❌ WRONG - Don't use font tokens on components
<Button fontSize="$4">Wrong context!</Button>
```

**Component Size Mappings:**

| Component | Size Variant | Height | Font Size (internal) |
|-----------|--------------|--------|---------------------|
| **Button** | `sm` | 32px (`$buttonSm`) | `$3` (13px) |
|            | `md` | 40px (`$buttonMd`) | `$4` (14px) |
|            | `lg` | 48px (`$buttonLg`) | `$5` (15px) |
| **Input**  | `sm` | 32px (`$inputSm`) | `$3` (13px) |
|            | `md` | 40px (`$inputMd`) | `$4` (14px) |
|            | `lg` | 48px (`$inputLg`) | `$5` (15px) |
| **Badge**  | `sm` | 20px min | Text within uses fontSize |
|            | `md` | 24px min | Text within uses fontSize |
|            | `lg` | 28px min | Text within uses fontSize |
| **Spinner** | `sm` | 16px (`$4` space token) | N/A |
|             | `md` | 20px (`$5` space token) | N/A |
|             | `lg` | 24px (`$6` space token) | N/A |

## Why This Design?

1. **Separation of Concerns:**
   - Font sizing is about typography and readability
   - Component sizing is about touch targets and visual hierarchy
   - Mixing these causes confusion and errors

2. **Type Safety:**
   - Named variants have fixed options (`sm | md | lg`)
   - Numeric tokens use Tamagui's type system for autocomplete
   - This prevents invalid values at compile time

3. **Flexibility:**
   - Text can be any font size independent of component size
   - Components can have consistent heights across different text sizes
   - Example: A large button with small text, or small badge with readable text

## Common Patterns

### Typography Sizing

```tsx
// Default body text
<Text fontSize="$5">Regular paragraph text</Text>

// Small helper text
<Text fontSize="$3" color="$textSecondary">
  Helper text below input
</Text>

// Large emphasis
<Text fontSize="$7" fontWeight="600">
  Call to action text
</Text>

// Headings (use level prop - it sets fontSize internally)
<Heading level={1}>Page Title</Heading>  {/* Uses $10 internally */}
<Heading level={2}>Section Title</Heading>  {/* Uses $9 internally */}
<Heading level={3}>Subsection</Heading>  {/* Uses $8 internally */}

// Manual heading sizing (when you need non-standard sizes)
<Text fontFamily="$heading" fontSize="$6" fontWeight="700">
  Custom heading size
</Text>
```

### Component Sizing

```tsx
// Buttons - size controls height and padding
<Button size="sm" tone="outline">Cancel</Button>
<Button size="md" tone="primary">Submit</Button>
<Button size="lg" tone="primary">Hero CTA</Button>

// Inputs - size controls height and padding
<Input size="sm" placeholder="Compact input" />
<Input size="md" placeholder="Standard input" />
<Input size="lg" placeholder="Large input" />

// Badges with custom text size
<Badge variant="success" size="sm">
  <Text fontSize="$2">9</Text>  {/* Small text in small badge */}
</Badge>

<Badge variant="info" size="lg">
  <Text fontSize="$4">NEW</Text>  {/* Readable text in large badge */}
</Badge>
```

### Mixed Examples

```tsx
// Large button with custom text size
<Button size="lg">
  <Text fontSize="$6" fontWeight="700">BIG TEXT</Text>
</Button>

// Form with consistent sizing
<Column gap="$md">
  <Label fontSize="$3">Email Address</Label>
  <Input size="md" placeholder="you@example.com" />
  <Text fontSize="$3" color="$textMuted">
    We'll never share your email
  </Text>
</Column>

// Card with varied text sizes
<Card padding="lg">
  <Heading level={3}>Card Title</Heading>  {/* $8 */}
  <Text fontSize="$5">Card description text</Text>  {/* $5 */}
  <Text fontSize="$3" color="$textSecondary">
    Posted 2 hours ago
  </Text>  {/* $3 */}
</Card>
```

## Migration Guide

### Replacing Invalid Size Usage

```tsx
// ❌ BEFORE - Invalid size tokens
<Text size="md">Text</Text>
<Text size="$md">Text</Text>
<Text size="lg">Text</Text>

// ✅ AFTER - Correct numeric tokens
<Text fontSize="$4">Text</Text>   // md ≈ 14px
<Text fontSize="$5">Text</Text>   // default body
<Text fontSize="$6">Text</Text>   // lg ≈ 16px
```

### Converting from fontSize to Component Size

```tsx
// ❌ BEFORE - Using fontSize on Button
<Button fontSize="$4">Submit</Button>

// ✅ AFTER - Using size variant
<Button size="md">Submit</Button>  // Includes $4 font size internally
```

## Troubleshooting

### Error: "no size md"

**Problem:** Using named size (`"md"`, `"lg"`) on a Text component

**Solution:** Use numeric token with fontSize prop instead
```tsx
// ❌ WRONG
<Text size="md">Text</Text>

// ✅ CORRECT
<Text fontSize="$4">Text</Text>
```

### Error: "no size $4"

**Problem:** Using numeric token with size prop on Text component

**Solution:** Use fontSize prop instead of size prop
```tsx
// ❌ WRONG
<Text size="$4">Text</Text>

// ✅ CORRECT
<Text fontSize="$4">Text</Text>
```

### Button text is wrong size

**Problem:** Trying to override button font size with component size

**Solution:** Use the correct size variant or wrap text in Text component
```tsx
// ❌ WRONG
<Button fontSize="$6">Text</Button>

// ✅ CORRECT (use size variant)
<Button size="lg">Text</Button>

// ✅ CORRECT (custom text size)
<Button size="md">
  <Text fontSize="$6">Custom size text</Text>
</Button>
```

## Quick Reference

| Context | Prop to Use | Values | Example |
|---------|-------------|--------|---------|
| **Text/Heading/Label font size** | `fontSize` | `$1` - `$16` | `<Text fontSize="$5">` |
| **Button geometric size** | `size` | `sm \| md \| lg` | `<Button size="md">` |
| **Input geometric size** | `size` | `sm \| md \| lg` | `<Input size="lg">` |
| **Badge geometric size** | `size` | `sm \| md \| lg` | `<Badge size="sm">` |
| **Spinner geometric size** | `size` | `sm \| md \| lg` | `<Spinner size="md">` |
| **Spacing** | `padding`, `margin`, `gap` | `$xs`, `$sm`, `$md`, etc. | `<View padding="$md">` |

## Best Practices

1. **Use semantic components:** Prefer `<Heading level={2}>` over manually setting fontSize
2. **Stay consistent:** Use the size variants provided by components
3. **Document overrides:** If you need custom sizes, add a comment explaining why
4. **Test cross-platform:** Verify sizing works on both web and mobile
5. **Use tokens:** Always use `$` prefix for tokens (spacing, colors, font sizes)

## Related Documentation

- [Tamagui Configuration](/packages/config/src/tamagui.config.ts) - Full token definitions
- [Component Library](/packages/ui/README.md) - Component API reference
- [Typography Components](/packages/ui/src/components/Text.tsx) - Text, Heading, Label
- [Copilot Instructions](/.github/copilot-instructions.md) - Design system guidelines
