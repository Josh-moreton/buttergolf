# Finding Routes That Need Layout Fixes

**Date**: November 21, 2025
**Purpose**: Systematic search for routes still using old layout patterns that should migrate to the new minimal shim approach
**Status**: ✅ COMPLETE

**Result**: Migration complete! All 3 issues found and fixed. See [LAYOUT_MIGRATION_COMPLETE.md](./LAYOUT_MIGRATION_COMPLETE.md) for full details.

---

## What We're Looking For

After fixing `/listings`, we need to find other routes that may still be using:

### ❌ Old Patterns (Need Fixing)
1. **Custom variant props on Row/Column** that were removed
   - `gap="md"` (without `$` prefix)
   - `align="center"` (instead of `alignItems`)
   - `justify="between"` (instead of `justifyContent`)

2. **Type assertion workarounds**
   - `{...{ gap: "md" as any }}`
   - `{...{ align: "center" as any }}`

3. **Importing old variant documentation**
   - Components built assuming variants exist
   - Usage of removed variant names

### ✅ New Patterns (Already Fixed)
1. **Direct token props**
   - `gap="$md"`
   - `padding="$lg"`
   
2. **Native React Native flexbox props**
   - `alignItems="center"`
   - `justifyContent="space-between"`

3. **No type assertions needed**
   - Clean, type-safe code

---

## Search Strategy

### Phase 1: Automated Grep Searches

#### 1. Find Old Variant Usage (Likely Issues)

```bash
# Search for gap without $ (custom variant)
grep -r 'gap="[^$]' apps/web/src/app --include="*.tsx" --include="*.ts"

# Search for align prop (removed variant)
grep -r 'align="' apps/web/src/app --include="*.tsx" --include="*.ts"

# Search for justify prop (removed variant)
grep -r 'justify="' apps/web/src/app --include="*.tsx" --include="*.ts"

# Search for type assertions (workarounds)
grep -r 'as any' apps/web/src/app --include="*.tsx" --include="*.ts"
```

#### 2. Find XStack/YStack Usage (Should be Row/Column)

```bash
# Find direct XStack usage (should be Row)
grep -r '<XStack' apps/web/src/app --include="*.tsx"

# Find direct YStack usage (should be Column)
grep -r '<YStack' apps/web/src/app --include="*.tsx"
```

#### 3. Find Import Patterns

```bash
# Find old layout imports
grep -r "import.*XStack.*from '@buttergolf/ui'" apps/web/src/app --include="*.tsx"
grep -r "import.*YStack.*from '@buttergolf/ui'" apps/web/src/app --include="*.tsx"

# Verify using Row/Column
grep -r "import.*Row.*from '@buttergolf/ui'" apps/web/src/app --include="*.tsx"
grep -r "import.*Column.*from '@buttergolf/ui'" apps/web/src/app --include="*.tsx"
```

---

## Search Results

### Routes to Investigate

Run these commands to find potentially problematic routes:

```bash
cd /Users/joshmoreton/GitHub/buttergolf

# 1. Old variant usage
echo "=== Searching for old gap variant usage ==="
grep -r 'gap="[a-z]' apps/web/src/app --include="*.tsx" | grep -v 'gap="\$' | head -20

echo "\n=== Searching for align prop (removed) ==="
grep -r 'align="' apps/web/src/app --include="*.tsx" | head -20

echo "\n=== Searching for justify prop (removed) ==="
grep -r 'justify="' apps/web/src/app --include="*.tsx" | head -20

echo "\n=== Searching for type assertions ==="
grep -r '{\.\.\.{.*as any' apps/web/src/app --include="*.tsx" | head -20

# 2. Direct primitive usage
echo "\n=== XStack usage (should be Row?) ==="
grep -r '<XStack' apps/web/src/app --include="*.tsx" | wc -l

echo "\n=== YStack usage (should be Column?) ==="
grep -r '<YStack' apps/web/src/app --include="*.tsx" | wc -l
```

---

## Manual Review Checklist

For each route directory found, review:

### Step 1: Check Main Page Component

```bash
# Example: Check /products route
cat apps/web/src/app/products/page.tsx
```

Look for:
- [ ] Uses Row/Column (not XStack/YStack)
- [ ] Uses `gap="$md"` (not `gap="md"`)
- [ ] Uses `alignItems` (not `align`)
- [ ] Uses `justifyContent` (not `justify`)
- [ ] No `as any` type assertions

### Step 2: Check Client Components

```bash
# Find all client components in route
find apps/web/src/app/products -name "*Client.tsx" -o -name "*client.tsx"
```

Review each for same checklist above.

### Step 3: Check Nested Components

```bash
# Find all components in _components directory
find apps/web/src/app/products/_components -name "*.tsx"
```

---

## Priority Routes to Check

Based on complexity and usage, check these in order:

### High Priority (Complex Layouts)
1. ✅ `/listings` - **FIXED** (template for others)
2. 🔍 `/category/[slug]` - Uses ListingsClient (likely fixed)
3. 🔍 `/products/[id]` - Product detail page
4. 🔍 `/sell` - Complex form layout
5. 🔍 `/checkout` - Multi-step layout
6. 🔍 `/favorites` - Grid layout

### Medium Priority (Standard Pages)
7. 🔍 `/` - Homepage
8. 🔍 `/cart` - Cart page
9. 🔍 `/seller-hub` - Seller dashboard
10. 🔍 `/profile` - User profile

### Low Priority (Simple Pages)
11. 🔍 `/about` - Static content
12. 🔍 `/contact` - Simple form
13. 🔍 `/sign-in` - Auth page
14. 🔍 `/sign-up` - Auth page

---

## Automated Detection Script

Create a script to automatically detect problematic patterns:

```bash
#!/bin/bash
# File: scripts/find-old-layout-patterns.sh

echo "=== ButterGolf Layout Pattern Detection ==="
echo "Searching for old patterns that need migration...\n"

APPS_DIR="apps/web/src/app"
ISSUES_FOUND=0

# Function to search and count
search_pattern() {
  local pattern=$1
  local description=$2
  local results=$(grep -r "$pattern" "$APPS_DIR" --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | tr -d ' ')
  
  if [ "$results" -gt 0 ]; then
    echo "❌ Found $results instances: $description"
    ISSUES_FOUND=$((ISSUES_FOUND + results))
    grep -r "$pattern" "$APPS_DIR" --include="*.tsx" --include="*.ts" 2>/dev/null | head -5
    echo ""
  fi
}

# Search for old patterns
search_pattern 'gap="[a-z]' "gap without $ prefix (old variant)"
search_pattern 'align="[a-z]' "align prop (removed variant)"
search_pattern 'justify="[a-z]' "justify prop (removed variant)"
search_pattern '{\.\.\.{.*as any' "type assertions (workaround)"

# Summary
echo "\n=== Summary ==="
if [ "$ISSUES_FOUND" -eq 0 ]; then
  echo "✅ No issues found! All routes using new patterns."
else
  echo "⚠️  Found $ISSUES_FOUND potential issues"
  echo "Review files listed above and migrate to new patterns."
fi
```

Make executable and run:
```bash
chmod +x scripts/find-old-layout-patterns.sh
./scripts/find-old-layout-patterns.sh
```

---

## Migration Template

For each route that needs fixing, follow this template:

### 1. Identify Components to Update

```bash
# List all TypeScript files in route
find apps/web/src/app/ROUTE_NAME -name "*.tsx" -o -name "*.ts"
```

### 2. Create Migration Checklist

```markdown
## Route: /ROUTE_NAME

### Files to Update:
- [ ] `page.tsx` - Main page component
- [ ] `ClientComponent.tsx` - Client component
- [ ] `_components/Component1.tsx`
- [ ] `_components/Component2.tsx`

### Changes Needed:
- [ ] Replace `gap="md"` with `gap="$md"`
- [ ] Replace `align="center"` with `alignItems="center"`
- [ ] Replace `justify="between"` with `justifyContent="space-between"`
- [ ] Remove `{...{ prop: value as any }}` patterns
- [ ] Replace `XStack` with `Row`
- [ ] Replace `YStack` with `Column`

### Testing:
- [ ] TypeScript compiles without errors
- [ ] No `as any` type assertions
- [ ] Layout renders correctly on desktop
- [ ] Layout renders correctly on mobile
- [ ] Responsive breakpoints work
```

### 3. Apply Changes Using multi_replace_string_in_file

```typescript
// Use the multi_replace tool for batch updates
[
  {
    filePath: "apps/web/src/app/ROUTE/component.tsx",
    oldString: `<Row {...{ gap: "md" as any }} align="center">`,
    newString: `<Row gap="$md" alignItems="center">`,
    explanation: "Remove type assertion, use native props"
  },
  // ... more replacements
]
```

### 4. Verify Changes

```bash
# 1. Type check
pnpm check-types

# 2. Build
pnpm build:web

# 3. Manual testing
pnpm dev:web
# Navigate to route and verify layout
```

---

## Common Migration Patterns

### Pattern 1: Gap Prop
```tsx
// BEFORE
<Row {...{ gap: "md" as any }}>
  <Text>Content</Text>
</Row>

// AFTER
<Row gap="$md">
  <Text>Content</Text>
</Row>
```

### Pattern 2: Alignment Props
```tsx
// BEFORE
<Row align="center" justify="between">
  <Text>Left</Text>
  <Text>Right</Text>
</Row>

// AFTER
<Row alignItems="center" justifyContent="space-between">
  <Text>Left</Text>
  <Text>Right</Text>
</Row>
```

### Pattern 3: Combined Props
```tsx
// BEFORE
<Column 
  {...{ gap: "lg" as any }}
  align="stretch"
  fullWidth
>
  <Text>Content</Text>
</Column>

// AFTER
<Column 
  gap="$lg"
  alignItems="stretch"
  width="100%"
>
  <Text>Content</Text>
</Column>
```

### Pattern 4: Media Queries
```tsx
// BEFORE
<Row 
  {...{ gap: "sm" as any }}
  $gtMd={{ gap: "lg" as any }}
>
  <Text>Content</Text>
</Row>

// AFTER
<Row 
  gap="$sm"
  $gtMd={{ gap: "$lg" }}
>
  <Text>Content</Text>
</Row>
```

### Pattern 5: XStack/YStack → Row/Column
```tsx
// BEFORE
import { XStack, YStack } from '@buttergolf/ui'

<XStack gap="$4" alignItems="center">
  <YStack gap="$2">
    <Text>Title</Text>
  </YStack>
</XStack>

// AFTER
import { Row, Column } from '@buttergolf/ui'

<Row gap="$4" alignItems="center">
  <Column gap="$2">
    <Text>Title</Text>
  </Column>
</Row>
```

---

## Validation Criteria

A route is considered **fully migrated** when:

### Code Quality
- ✅ No TypeScript errors
- ✅ No `as any` type assertions
- ✅ Uses Row/Column (not XStack/YStack)
- ✅ Uses tokens with `$` prefix
- ✅ Uses native React Native flexbox props

### Functionality
- ✅ Layout renders correctly
- ✅ Responsive breakpoints work
- ✅ Interactive elements functional
- ✅ No console warnings/errors

### Performance
- ✅ Build completes successfully
- ✅ No bundle size increase
- ✅ No render performance regression

---

## Tracking Progress

Create a tracking document for each route found:

```markdown
# Layout Migration Progress

## Status Legend
- ✅ Migrated and verified
- 🔄 In progress
- 🔍 Needs investigation
- ❌ Has issues

## Routes

| Route | Status | Files | Issues | Assignee | Date |
|-------|--------|-------|--------|----------|------|
| /listings | ✅ | 8 | 0 | - | 2025-11-21 |
| /category/[slug] | ✅ | 1 | 0 | - | 2025-11-21 |
| /products/[id] | 🔍 | ? | ? | - | - |
| /sell | 🔍 | ? | ? | - | - |
| ... | | | | | |

## Total Progress
- Routes Checked: 2 / 14
- Routes Migrated: 2 / 14
- Completion: 14%
```

---

## Next Steps

1. **Run automated detection script**
   - Creates list of files with potential issues

2. **Manual review of high-priority routes**
   - Verify issues are real (not false positives)
   - Create migration plan for each

3. **Batch migration**
   - Group similar changes together
   - Use multi_replace for efficiency

4. **Testing**
   - Full regression test
   - Visual QA on all updated routes

5. **Documentation**
   - Update component usage examples
   - Add migration notes to CHANGELOG

---

## References

- `docs/LISTINGS_LAYOUT_FIX_COMPLETE.md` - Template for migrations
- `docs/COMPONENT_LIBRARY_AUDIT.md` - Component patterns
- `packages/ui/src/components/Layout.tsx` - Current implementation
- `.github/copilot-instructions.md` - Updated guidelines

---

## Automation Ideas

### Future Enhancements

1. **ESLint Rule**
   ```javascript
   // Warn on old patterns
   "buttergolf/no-variant-props": "error"
   ```

2. **Codemod Script**
   ```bash
   # Automated migration
   npx jscodeshift -t scripts/migrate-layout-props.ts apps/web/src/app
   ```

3. **Pre-commit Hook**
   ```bash
   # Block commits with old patterns
   ./scripts/find-old-layout-patterns.sh
   ```

4. **CI/CD Check**
   ```yaml
   # GitHub Actions
   - name: Check layout patterns
     run: ./scripts/find-old-layout-patterns.sh
   ```

---

**Status**: Ready to execute search and create migration plan based on results.
