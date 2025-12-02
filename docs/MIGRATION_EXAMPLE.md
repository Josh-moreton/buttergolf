# Tamagui Migration Example: Step-by-Step Guide

This document shows a real example of migrating a component from hardcoded colors to theme tokens.

---

## Example: Migrating Product Page Breadcrumbs

### Before (Hardcoded Colors)

```tsx
// apps/web/src/app/products/[slug]/page.tsx
import { YStack, XStack, Text } from "@buttergolf/ui";
import Link from "next/link";

export default function ProductPage() {
  return (
    <YStack paddingTop={140} backgroundColor="#F7F7F7">
      <YStack maxWidth={1200} marginHorizontal="auto" paddingHorizontal="$4">
        <XStack gap="$2" paddingVertical="$4">
          <Link href="/" style={{ textDecoration: "none" }}>
            <Text color="#3C50E0">Home</Text>
          </Link>
          <Text>/</Text>
          <Link href="/products" style={{ textDecoration: "none" }}>
            <Text color="#3C50E0">Products</Text>
          </Link>
          <Text>/</Text>
          <Text>{product.title}</Text>
        </XStack>
        {/* Rest of content */}
      </YStack>
    </YStack>
  );
}
```

**Issues Identified**:

1. ❌ `backgroundColor="#F7F7F7"` - Hardcoded background color
2. ❌ `color="#3C50E0"` (2x) - Hardcoded link color
3. ❌ `paddingTop={140}` - Raw pixel value (could use token)

---

### After (Theme Tokens)

```tsx
// apps/web/src/app/products/[slug]/page.tsx
import { YStack, XStack, Text } from "@buttergolf/ui";
import Link from "next/link";

export default function ProductPage() {
  return (
    <YStack paddingTop="$16" backgroundColor="$bgGray">
      <YStack maxWidth={1200} marginHorizontal="auto" paddingHorizontal="$4">
        <XStack gap="$2" paddingVertical="$4">
          <Link href="/" style={{ textDecoration: "none" }}>
            <Text color="$blue" hoverStyle={{ color: "$blueLight" }}>
              Home
            </Text>
          </Link>
          <Text color="$muted">/</Text>
          <Link href="/products" style={{ textDecoration: "none" }}>
            <Text color="$blue" hoverStyle={{ color: "$blueLight" }}>
              Products
            </Text>
          </Link>
          <Text color="$muted">/</Text>
          <Text color="$text">{product.title}</Text>
        </XStack>
        {/* Rest of content */}
      </YStack>
    </YStack>
  );
}
```

**Improvements**:

1. ✅ `backgroundColor="$bgGray"` - Uses semantic token
2. ✅ `color="$blue"` - Uses semantic token for links
3. ✅ Added `hoverStyle` for better UX
4. ✅ `paddingTop="$16"` - Uses spacing token (140px ≈ $16)
5. ✅ Breadcrumb separators use `$muted` for subtle appearance
6. ✅ Current page text uses `$text` for clarity

---

## Step-by-Step Migration Process

### Step 1: Identify Hardcoded Values

Run the audit script:

```bash
node scripts/audit-tamagui-usage.js
```

Or manually search:

```bash
grep -rn "#[0-9A-Fa-f]\{6\}" apps/web/src/app/products/
```

### Step 2: Map to Semantic Tokens

For each hardcoded value, find the appropriate token:

| Hardcoded Value | Token        | Purpose               |
| --------------- | ------------ | --------------------- |
| `#F7F7F7`       | `$bgGray`    | Light gray background |
| `#3C50E0`       | `$blue`      | Primary link color    |
| `#93C5FD`       | `$blueLight` | Hover state for links |
| `#1C274C`       | `$textDark`  | Dark text emphasis    |
| `140` (px)      | `$16`        | Large top padding     |

**Reference**: Check `packages/config/src/tamagui.config.ts` for all available tokens.

### Step 3: Replace Values

Make the replacements one at a time:

```tsx
// 1. Replace background color
- backgroundColor="#F7F7F7"
+ backgroundColor="$bgGray"

// 2. Replace link colors
- color="#3C50E0"
+ color="$blue"

// 3. Add hover states (bonus improvement)
+ hoverStyle={{ color: "$blueLight" }}

// 4. Use spacing tokens
- paddingTop={140}
+ paddingTop="$16"
```

### Step 4: Test on Both Platforms

```bash
# Test on web
pnpm dev:web

# Test on mobile (if component is used there)
pnpm dev:mobile
```

### Step 5: Verify Type Checking

```bash
pnpm check-types
```

---

## More Examples

### Example 2: Button with Hardcoded Background

**Before**:

```tsx
<Button backgroundColor="#1C274C" hoverStyle={{ backgroundColor: "#3C50E0" }}>
  Shop Now
</Button>
```

**After**:

```tsx
<Button
  backgroundColor="$textDark"
  hoverStyle={{ backgroundColor: "$blue" }}
  pressStyle={{ scale: 0.97 }}
>
  Shop Now
</Button>
```

**Benefits**:

- Theme-aware (will work with light/dark mode)
- Semantic naming is self-documenting
- Added press style for better UX

---

### Example 3: Placeholder Cards

**Before**:

```tsx
const images = [
  { id: "club", color: "#2d3436", label: "Golf Club" },
  { id: "ball", color: "#dfe6e9", label: "Golf Ball" },
  { id: "bag", color: "#636e72", label: "Golf Bag" },
];
```

**After**:

```tsx
const images = [
  { id: "club", color: "$gray700", label: "Golf Club" },
  { id: "ball", color: "$gray100", label: "Golf Ball" },
  { id: "bag", color: "$gray500", label: "Golf Bag" },
];
```

**Usage**:

```tsx
<View
  backgroundColor={item.color} // Now uses token
  borderRadius="$4"
  padding="$4"
/>
```

---

### Example 4: Badge Component

**Before**:

```tsx
<XStack
  backgroundColor="#DC2626"
  paddingHorizontal="$3"
  paddingVertical="$1"
  borderRadius="$3"
>
  <Text color="white">{count}</Text>
</XStack>
```

**After**:

```tsx
<XStack
  backgroundColor="$red"
  paddingHorizontal="$3"
  paddingVertical="$1"
  borderRadius="$3"
>
  <Text color="white" fontSize="$2" fontWeight="600">
    {count}
  </Text>
</XStack>
```

**Improvements**:

- Uses `$red` token
- Added font size and weight tokens
- Maintains visual appearance while being theme-aware

---

## Common Patterns

### Pattern 1: Link Color

```tsx
// Use $blue for links
<Text color="$blue" hoverStyle={{ color: "$blueLight" }}>
  Link text
</Text>
```

### Pattern 2: Section Background

```tsx
// Use $bg for main areas, $bgGray for alternating sections
<YStack backgroundColor="$bgGray" padding="$6">
  {/* Content */}
</YStack>
```

### Pattern 3: Card Backgrounds

```tsx
// Use $cardBg or $bgCard depending on desired effect
<Card backgroundColor="$cardBg" borderRadius="$4" padding="$4">
  {/* Content */}
</Card>
```

### Pattern 4: Text Hierarchy

```tsx
<YStack gap="$2">
  <Text color="$textDark" fontSize="$7" fontWeight="700">
    Primary heading
  </Text>
  <Text color="$text" fontSize="$5">
    Body text
  </Text>
  <Text color="$muted" fontSize="$3">
    Secondary text
  </Text>
</YStack>
```

---

## Quick Conversion Table

| Hardcoded | Token        | Use Case           |
| --------- | ------------ | ------------------ |
| `#fbfbf9` | `$bg`        | Main background    |
| `#F7F7F7` | `$bgGray`    | Section background |
| `#F6F7FB` | `$bgCard`    | Card background    |
| `#ffffff` | `$cardBg`    | White card         |
| `#0f1720` | `$text`      | Primary text       |
| `#1C274C` | `$textDark`  | Dark text          |
| `#6b7280` | `$muted`     | Muted text         |
| `#3C50E0` | `$blue`      | Links, CTAs        |
| `#93C5FD` | `$blueLight` | Hover states       |
| `#13a063` | `$green500`  | Primary brand      |
| `#0b6b3f` | `$green700`  | Brand hover        |
| `#02AAA4` | `$teal`      | Accent teal        |
| `#DC2626` | `$red`       | Alerts, badges     |
| `#D1D5DB` | `$gray400`   | Borders, dividers  |

---

## Pro Tips

### Tip 1: Batch Replace in VS Code

Use Find & Replace (Cmd/Ctrl + H) with regex:

```regex
Find: backgroundColor="#F7F7F7"
Replace: backgroundColor="$bgGray"
```

### Tip 2: Check Before Committing

Always run before committing:

```bash
node scripts/audit-tamagui-usage.js
pnpm check-types
pnpm lint
```

### Tip 3: Add Hover States

When migrating, add hover/press states for better UX:

```tsx
hoverStyle={{ backgroundColor: "$green700", scale: 1.02 }}
pressStyle={{ scale: 0.98 }}
```

### Tip 4: Document New Tokens

If you need a color not in the theme, add it to:

1. `packages/config/src/tamagui.config.ts`
2. `docs/TAMAGUI_BEST_PRACTICES.md`

---

## Need Help?

- Review [TAMAGUI_BEST_PRACTICES.md](./TAMAGUI_BEST_PRACTICES.md)
- Check [TAMAGUI_USAGE_AUDIT.md](./TAMAGUI_USAGE_AUDIT.md)
- Run `node scripts/audit-tamagui-usage.js`
- Look at other migrated components for examples

---

**Remember**: Every component migrated to use tokens makes the entire codebase more maintainable and theme-ready! 🎨
