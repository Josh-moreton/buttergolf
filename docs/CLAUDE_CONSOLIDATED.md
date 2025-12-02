# ButterGolf - Claude Code Instructions (Consolidated)

**Last Updated**: November 21, 2025  
**Version**: 2.0 (Post-Layout Fix)

---

## 🎯 CRITICAL RECENT CHANGES

### Layout System Fix (November 2025)

**BREAKING CHANGE**: Row and Column components are now **minimal shims** over Tamagui primitives, not custom variant systems.

#### ❌ OLD (Removed - Don't Use)

```tsx
// Custom variants that caused TypeScript conflicts
<Row gap="md" align="center" justify="between">
<Column gap="lg" align="stretch">
```

#### ✅ NEW (Current - Use This)

```tsx
// Native Tamagui props with tokens
<Row gap="$md" alignItems="center" justifyContent="space-between">
<Column gap="$lg" alignItems="stretch">
```

**Key Changes**:

- ✅ Use `gap="$md"` (with `$` prefix for tokens)
- ✅ Use `alignItems` (not `align`)
- ✅ Use `justifyContent` (not `justify`)
- ✅ No more `{...{ prop: value as any }}` type assertions
- ✅ Full Tamagui API available directly

**See**: `docs/LISTINGS_LAYOUT_FIX_COMPLETE.md` for complete analysis

---

## Project Overview

ButterGolf is a cross-platform golf equipment marketplace built with:

- **Web**: Next.js 16 (App Router)
- **Mobile**: Expo ~54 (React Navigation)
- **Shared**: Solito for navigation, Tamagui for UI

---

## Architecture

### Monorepo Structure (Turborepo + pnpm)

```
buttergolf/
├── apps/
│   ├── web/          # Next.js 16 App Router
│   └── mobile/       # Expo + React Navigation
├── packages/
│   ├── ui/           # Tamagui component library
│   ├── app/          # Shared screens (Solito-based)
│   ├── db/           # Prisma database client
│   ├── config/       # Tamagui configuration
│   ├── constants/    # Shared constants
│   └── assets/       # Shared assets
└── docs/             # Documentation
```

### Technology Stack

| Category            | Technology            | Version |
| ------------------- | --------------------- | ------- |
| **Build**           | Turborepo             | 2.6.0   |
| **Package Manager** | pnpm                  | 10.20.0 |
| **UI Framework**    | Tamagui               | 1.135.7 |
| **Database**        | Prisma + PostgreSQL   | 6.x     |
| **React**           | React                 | 19.1.0  |
| **TypeScript**      | TypeScript            | 5.9.2   |
| **Styling**         | Tailwind v4 + Tamagui | -       |
| **Navigation**      | Solito                | 5.0.0   |
| **Auth**            | Clerk                 | 6.34.1  |
| **Payments**        | Stripe                | 19.2.1  |
| **Images**          | Cloudinary            | -       |

---

## 🎨 Tamagui Design System

### Layout Components (Updated Nov 2025)

#### Row & Column - Minimal Shims

**Implementation**:

```tsx
// packages/ui/src/components/Layout.tsx
export const Row = styled(TamaguiXStack, {
  name: "Row",
  // No custom variants - preserves full XStack API
});

export const Column = styled(TamaguiYStack, {
  name: "Column",
  // No custom variants - preserves full YStack API
});
```

**Usage Pattern**:

```tsx
// ✅ CORRECT - Native Tamagui props with tokens
<Row
  gap="$md"
  alignItems="center"
  justifyContent="space-between"
  paddingHorizontal="$4"
  width="100%"
  $gtMd={{ gap: "$lg" }}
>
  <Text>Content</Text>
</Row>

<Column
  gap="$lg"
  alignItems="stretch"
  paddingVertical="$6"
  width="100%"
>
  <Heading level={2}>Title</Heading>
  <Text>Description</Text>
</Column>
```

**Why This Works**:

- ✅ No TypeScript conflicts (no custom variants)
- ✅ No type assertions needed
- ✅ Full Tamagui API available
- ✅ Better semantic naming (Row vs XStack)
- ✅ Compiler can optimize static props

#### Container - Good Variant Example

```tsx
export const Container = styled(TamaguiYStack, {
  name: "Container",
  width: "100%",
  marginHorizontal: "auto",

  variants: {
    size: {
      sm: { maxWidth: 640 },
      md: { maxWidth: 768 },
      lg: { maxWidth: 1024 },
      xl: { maxWidth: 1280 },
      "2xl": { maxWidth: 1536 },
      full: { maxWidth: "100%" },
    },
  } as const,
});
```

**Why This is Good**:

- ✅ Component-specific (maxWidth concept unique to containers)
- ✅ Design system boundary (enforces approved widths)
- ✅ No base prop conflict
- ✅ Semantic value ("lg" clearer than "1024px")

---

### Color System

#### Semantic Tokens (USE IN APP CODE)

**ALWAYS prefer semantic tokens for automatic theme switching:**

```tsx
// ✅ CORRECT - Semantic tokens (99% of app code)
<Button backgroundColor="$primary" color="$textInverse">
<Text color="$text">Primary text</Text>
<Text color="$textSecondary">Secondary text</Text>
<Text color="$textMuted">Helper text</Text>
<View borderColor="$border" backgroundColor="$background">
```

#### Brand Color Tokens (USE IN COMPONENT LIBRARIES)

```tsx
// ⚠️ USE SPARINGLY - Component library defaults only
$ironstone: #323232      // Primary text
$slateSmoke: #545454     // Secondary text
$cloudMist: #EDEDED      // Borders
$vanillaCream: #FFFAD2   // Light backgrounds
$spicedClementine: #F45314  // Primary brand
$burntOlive: #3E3B2C     // Secondary brand
$lemonHaze: #EDECC3      // Tertiary
$pureWhite: #FFFFFF      // Pure white
```

**When to Use Which**:

- **Semantic tokens** → 99% of app code (automatic theme switching)
- **Brand tokens** → Component defaults in `packages/ui`
- **Raw hex** → Never use

---

### Typography System

#### Font Size Tokens (Numeric Scale)

```tsx
// Standard Tamagui numeric size tokens ($1-$16)
<Text size="$4">Small (14px)</Text>
<Text size="$5">Medium (15px) - DEFAULT</Text>
<Text size="$6">Large (16px)</Text>
<Text size="$7">XL (18px)</Text>
<Text size="$8">2XL (20px)</Text>

// ❌ WRONG
<Text fontSize="$5">Wrong!</Text>  // Use size prop
<Text size="md">Wrong!</Text>       // Named sizes don't exist
```

#### Text Component

```tsx
<Text
  size="$5" // Font size (numeric token)
  color="$text" // Direct token reference
  weight="600" // Font weight
  textAlign="center" // Native prop
  truncate // Boolean prop
>
  Content
</Text>
```

#### Heading Component

```tsx
<Heading
  level={2} // Semantic HTML level (h1-h6)
  color="$text" // Direct token reference
>
  Section Title
</Heading>
```

---

### Button System

#### Standard Tamagui Button (USE THIS)

```tsx
// ✅ CORRECT - Standard Tamagui Button with direct props
<Button
  size="$5"                      // Numeric size token
  backgroundColor="$primary"      // Direct color token
  color="$textInverse"           // Text color
  paddingHorizontal="$6"         // Horizontal padding
  paddingVertical="$3"           // Vertical padding
  borderRadius="$full"           // Border radius (pill shape)
  width="100%"                   // Full width if needed
  chromeless                     // Ghost style (boolean)
>
  Button Text
</Button>

// ❌ WRONG - Never create manual HTML buttons
<button style={{ backgroundColor: "#F45314" }}>Click me</button>
```

**Button Patterns**:

```tsx
// Primary (pill-shaped)
<Button size="$5" backgroundColor="$primary" color="$textInverse" borderRadius="$full">
  Primary
</Button>

// Outline (pill-shaped)
<Button size="$4" backgroundColor="transparent" color="$primary" borderWidth={2} borderColor="$primary" borderRadius="$full">
  Secondary
</Button>

// Ghost/Chromeless
<Button size="$4" chromeless>
  Cancel
</Button>
```

---

## Component Usage Guidelines

### ✅ DO: Use Semantic Tokens

```tsx
// ✅ Semantic tokens enable theme switching
<Button backgroundColor="$primary" color="$textInverse">
<Text color="$text">
<View borderColor="$border" backgroundColor="$surface">
```

### ✅ DO: Use Native Tamagui Props

```tsx
// ✅ Direct props with tokens
<Row gap="$md" alignItems="center" paddingHorizontal="$4">
<Column gap="$lg" justifyContent="flex-start" width="100%">
```

### ✅ DO: Use Standard Button

```tsx
// ✅ Standard Tamagui Button
<Button size="$5" backgroundColor="$primary" color="$textInverse">
```

### ❌ DON'T: Use Old Variant Patterns

```tsx
// ❌ Custom variants removed
<Row gap="md" align="center" justify="between">

// ❌ Type assertions needed
<Row {...{ gap: "md" as any }}>

// ❌ Manual HTML buttons
<button style={{ backgroundColor: "#F45314" }}>
```

### ❌ DON'T: Use Raw Hex Values

```tsx
// ❌ No theme support
<Button backgroundColor="#F45314">

// ❌ Hard to maintain
<Text color="#323232">
```

---

## Navigation Architecture (Solito)

### THIS IS NOT EXPO ROUTER

**Critical**: This is a **Solito-based monorepo**, not Expo Router.

#### How It Works

```
┌─────────────────┐
│ packages/app/   │  ← Shared screens (platform-agnostic)
│ screens          │     Uses solito/link and solito/navigation
└─────────────────┘
        │
        ├──→ apps/web/        Next.js App Router (automatic)
        └──→ apps/mobile/     React Navigation (manual registration)
```

#### Adding a New Screen

1. **Define route** in `packages/app/src/navigation/routes.ts`
2. **Create screen** in `packages/app/src/features/[feature]/[screen-name].tsx`
3. **Export** from `packages/app/src/index.ts`
4. **Web**: Create `apps/web/src/app/[route]/page.tsx` (automatic)
5. **Mobile**: Register in `apps/mobile/App.tsx` (manual):

```typescript
// Linking config
const linking = {
  config: {
    screens: {
      MyNewScreen: { path: "my-route/:param" }
    }
  }
}

// Stack Navigator
<Stack.Screen name="MyNewScreen">
  {({ route }) => (
    <MyNewScreen
      param={route.params?.param}
      onFetchData={fetchDataFunction}
    />
  )}
</Stack.Screen>
```

**Common Mistakes**:

- ❌ Don't expect Expo Router file-based routing
- ❌ Don't create separate screens for web/mobile
- ❌ Don't forget to register routes in BOTH linking config AND Stack Navigator
- ✅ DO use `solito/navigation` hooks
- ✅ DO use Tamagui for UI (works everywhere)
- ✅ DO pass data fetching as props (keeps screens pure)

---

## Database (Prisma)

### CRITICAL: Migration Workflow

**🚨 NEVER USE `db:push` - ALWAYS USE MIGRATIONS 🚨**

```bash
# ✅ CORRECT - Create migration
cd packages/db
pnpm prisma migrate dev --name descriptive-change-name

# ❌ WRONG - Causes drift
pnpm prisma db push
```

**If You Encounter Drift**:

```bash
cd packages/db
pnpm prisma migrate reset --force  # Drops DB, reapplies migrations
cd ../..
pnpm db:seed  # Reseed data
```

**Why This Matters**:

- ✅ Migrations are version-controlled and deployable
- ✅ Team stays in sync
- ✅ Production deployments work
- ❌ `db:push` creates drift and requires data loss to fix

---

## Authentication (Clerk)

### Setup

**Web**: `@clerk/nextjs`
**Mobile**: `@clerk/clerk-expo`

### Environment Variables

```bash
# Web
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...

# Mobile
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
```

### Web Patterns

```tsx
// Server Component
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return <div>Protected Content</div>;
}
```

### Mobile Patterns

```tsx
// App.tsx
import { ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

<ClerkProvider
  publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
  tokenCache={SecureStore}
>
  <NavigationContainer>{/* ... */}</NavigationContainer>
</ClerkProvider>;
```

---

## Payments (Stripe)

### Setup

**Web**: `stripe` + `@stripe/stripe-js` + `@stripe/react-stripe-js`
**Mobile**: `@stripe/stripe-react-native`

### Web Pattern

```tsx
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

<Elements stripe={stripePromise}>
  <CheckoutForm />
</Elements>;
```

### Mobile Pattern

```tsx
import { StripeProvider } from "@stripe/stripe-react-native";

<StripeProvider
  publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
>
  {/* Your app */}
</StripeProvider>;
```

**Always use native SDK on mobile** - don't use web views.

---

## Image Upload (Cloudinary)

### Setup

```bash
# Environment Variables
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Usage

```tsx
// Server-side upload
import { v2 as cloudinary } from "cloudinary";

const result = await cloudinary.uploader.upload(image, {
  folder: "products",
  format: "auto",
  quality: "auto",
});

// Store result.secure_url in database
```

**Background Removal** (first image only):

```tsx
{
  transformation: [
    { effect: "background_removal" },
    { background: "rgb:FFFAD2" }, // Vanilla Cream brand color
  ];
}
```

---

## Critical Commands

```bash
# Development
pnpm dev:web          # Start Next.js (localhost:3000)
pnpm dev:mobile       # Start Expo

# Building
pnpm build            # Build all
pnpm build:web        # Build web
pnpm build:mobile     # Build mobile

# Type checking
pnpm check-types      # Check TypeScript

# Database
pnpm db:generate      # Generate Prisma Client
pnpm db:migrate:dev   # Create migration
pnpm db:studio        # Open Prisma Studio
pnpm db:seed          # Seed database

# Cleaning
pnpm clean-install    # Remove node_modules and reinstall
```

---

## Code Generation Hints

When generating new code:

### ✅ DO

1. **Use Context7 for library docs** - Always check current patterns
2. **Use semantic color tokens** - `$primary`, `$text`, `$background`
3. **Use standard Tamagui Button** - Numeric size tokens, direct props
4. **Use Row/Column with native props** - `gap="$md"`, `alignItems="center"`
5. **Use Text with numeric size** - `size="$5"` (standard Tamagui)
6. **Await params in Next.js 15+** - `const params = await props.params`
7. **Use optional chaining** - `data?.property || fallback`

### ❌ DON'T

1. **Don't create custom variants for native props** - Causes TypeScript conflicts
2. **Don't use `db:push`** - Always use migrations
3. **Don't use raw hex colors** - Use tokens
4. **Don't use `fontSize` prop on Text** - Use `size` prop
5. **Don't create manual HTML buttons** - Use Tamagui Button
6. **Don't use custom alignment variants** - Use native `alignItems`/`justifyContent`

---

## Common Patterns

### Product Card

```tsx
<Card variant="elevated" padding="none" fullWidth>
  <Card.Header padding="none" noBorder>
    <Image source={{ uri: product.imageUrl }} width="100%" height={200} />
  </Card.Header>

  <Card.Body padding="lg">
    <Column gap="$sm">
      <Heading level={4}>{product.name}</Heading>
      <Text color="$textSecondary">{product.category}</Text>
      <Row alignItems="center" justifyContent="space-between">
        <Text size="$8" weight="700">
          ${product.price}
        </Text>
        <Badge variant="success">In Stock</Badge>
      </Row>
    </Column>
  </Card.Body>

  <Card.Footer align="right">
    <Button
      size="$4"
      backgroundColor="transparent"
      color="$primary"
      borderWidth={2}
      borderColor="$primary"
    >
      Add to Cart
    </Button>
  </Card.Footer>
</Card>
```

### Form with Validation

```tsx
<Column gap="$lg" fullWidth>
  <Column gap="$xs">
    <Row gap="$xs">
      <Label htmlFor="email">Email</Label>
      <Text color="$error">*</Text>
    </Row>
    <Input id="email" type="email" size="md" error={!!emailError} fullWidth />
    {emailError && (
      <Text size="$4" color="$error">
        {emailError}
      </Text>
    )}
  </Column>

  <Button
    size="$5"
    backgroundColor="$primary"
    color="$textInverse"
    width="100%"
  >
    Submit
  </Button>
</Column>
```

### Responsive Layout

```tsx
<Container size="lg">
  <Column gap="$md" $gtMd={{ gap: "$lg" }}>
    <Row flexDirection="column" $gtSm={{ flexDirection: "row" }} gap="$md">
      <Column flex={1}>Content 1</Column>
      <Column flex={1}>Content 2</Column>
    </Row>
  </Column>
</Container>
```

---

## Documentation References

### Core Docs

- `docs/LISTINGS_LAYOUT_FIX_COMPLETE.md` - Layout system changes
- `docs/COMPONENT_LIBRARY_AUDIT.md` - Component patterns
- `docs/FINDING_ROUTES_NEEDING_FIXES.md` - Migration guide
- `.github/copilot-instructions.md` - Full project instructions

### External

- [Tamagui Documentation](https://tamagui.dev/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)

---

## Lessons Learned (Nov 2025)

### Layout System

**Problem**: Custom variants conflicted with Tamagui's base props
**Solution**: Minimal shims that expose full Tamagui API
**Result**: Simpler, faster, type-safe

### Key Principles

1. **Don't reinvent Tamagui** - It's already semantic
2. **Use tokens directly** - `gap="$md"` not `gap="md"`
3. **Variants for component-specific only** - Container size, Card variant
4. **Trust Tamagui's design** - Built this way for a reason

---

**Status**: Current as of November 21, 2025 post-layout fix
