# Component Library Migration - Action Plan
**Date**: November 2, 2025  
**Estimated Total Time**: 2-3 weeks  
**Expected Impact**: +40% consistency, significantly improved maintainability

---

## 🎯 Executive Summary

Your component library is **production-ready and excellent**, but adoption is inconsistent:
- ✅ **Mobile**: 95% adherence (follow mobile patterns!)
- ⚠️ **Web**: 45% adherence (needs systematic migration)
- ⚠️ **Shared**: 60% adherence (mixed patterns)

**Goal**: Achieve 90%+ consistent usage across all platforms.

---

## 📊 Quick Metrics

### Current State
```
Component Library Usage:     50% → Target: 90%
Semantic Tokens:            65% → Target: 95%
Layout Components:          30% → Target: 90%
Compound Cards:             15% → Target: 90%
Button Variants:            45% → Target: 90%
```

### Impact of Full Migration
- **+25% code readability** (semantic components)
- **+40% consistency** (standardized patterns)
- **-30% manual styling** (use variants)
- **100% theme support** (dark mode ready)

---

## 🚀 3-Week Migration Plan

### Week 1: Foundation (High Impact, Low Effort)

#### Day 1-2: Layout Component Migration
**Goal**: Replace all XStack/YStack with Row/Column

**Automated Script**:
```bash
#!/bin/bash
# File: scripts/migrate-layout-components.sh

echo "🔄 Migrating layout components..."

# Backup first
git checkout -b migration/layout-components

# Replace XStack with Row
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/<XStack/<Row/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/<\/XStack>/<\/Row>/g' {} \;

# Replace YStack with Column  
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/<YStack/<Column/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/<\/YStack>/<\/Column>/g' {} \;

# Update imports
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/import { XStack, YStack/import { Row, Column/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/import { YStack, XStack/import { Row, Column/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/XStack, YStack/Row, Column/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/YStack, XStack/Row, Column/g' {} \;

echo "✅ Layout components migrated!"
echo "⚠️  Manual verification required for:"
echo "   - Prop mappings (alignItems → align, justifyContent → justify)"
echo "   - Gap values (gap=\"\$4\" → gap=\"md\")"
```

**Manual Verification Steps**:
1. Run type checking: `pnpm check-types`
2. Search for prop inconsistencies:
   ```bash
   # Find old prop names
   grep -r "alignItems" apps/web packages/app --include="*.tsx"
   grep -r "justifyContent" apps/web packages/app --include="*.tsx"
   ```
3. Update prop names:
   - `alignItems="center"` → `align="center"`
   - `justifyContent="space-between"` → `justify="between"`
   - `justifyContent="flex-start"` → `justify="start"`

**Files Affected**: ~35 files

**Expected Impact**: +25% consistency

---

#### Day 3-4: Card Compound Component Migration
**Goal**: Replace CardHeader/CardFooter with Card.Header/Card.Footer

**Manual Migration Pattern**:
```tsx
// BEFORE (search for this pattern)
import { Card, CardHeader, CardFooter } from '@buttergolf/ui'

<Card variant="elevated" padding={0}>
  <CardHeader padding={0}>
    <Image />
  </CardHeader>
  <CardFooter padding="$md">
    <Text>Footer</Text>
  </CardFooter>
</Card>

// AFTER (replace with this)
import { Card } from '@buttergolf/ui'

<Card variant="elevated" padding="none">
  <Card.Header padding="none" noBorder>
    <Image />
  </Card.Header>
  <Card.Body padding="md">
    <Text>Content</Text>
  </Card.Body>
  <Card.Footer padding="md" align="right" noBorder>
    <Text>Footer</Text>
  </Card.Footer>
</Card>
```

**Files to Update**:
```bash
# Find all Card usages
grep -r "CardHeader\|CardFooter" apps/web packages/app --include="*.tsx"
```

**Key Files**:
- `packages/app/src/components/ProductCard.tsx` ⭐ High priority
- `apps/web/src/app/_components/marketplace/HeroSection.tsx`
- Any other Card implementations

**Expected Impact**: +10% consistency

---

#### Day 5: Testing & Verification

**Checklist**:
- [ ] Run `pnpm check-types` - No errors
- [ ] Run `pnpm lint` - No new issues
- [ ] Run `pnpm build` - Successful
- [ ] Test on web: `pnpm dev:web`
  - [ ] Homepage renders correctly
  - [ ] Product cards display properly
  - [ ] All buttons work
  - [ ] Layout looks identical to before
- [ ] Test on mobile: `pnpm dev:mobile`
  - [ ] App renders correctly
  - [ ] Onboarding works
  - [ ] Navigation functions
- [ ] Visual regression testing:
  - [ ] Compare screenshots before/after
  - [ ] Check responsive breakpoints
  - [ ] Verify dark mode (if enabled)

**If Issues Found**:
1. Check prop mappings
2. Verify imports are correct
3. Look for TypeScript errors
4. Test incrementally (commit working files, debug problem files)

---

### Week 2: Refinement (Medium Impact, Medium Effort)

#### Day 1-2: Button Variant Standardization
**Goal**: Use tone/size variants instead of manual styling

**Pattern Migration**:
```tsx
// BEFORE
<Button
  size="$4"
  backgroundColor="$primary"
  color="$textInverse"
  paddingHorizontal="$4"
  pressStyle={{ backgroundColor: '$primaryPress' }}
>
  Submit
</Button>

// AFTER
<Button size="md" tone="primary">
  Submit
</Button>
```

**Available Button API**:
```tsx
// Sizes: sm (32px), md (40px), lg (48px)
// Tones: primary, secondary, outline, ghost, success, error

<Button size="lg" tone="primary" fullWidth>Sign Up</Button>
<Button size="md" tone="outline">Learn More</Button>
<Button size="sm" tone="ghost">Cancel</Button>
<Button size="md" tone="error">Delete</Button>
```

**Search & Replace Strategy**:
```bash
# Find all Button usages with manual styling
grep -r "<Button" apps/web packages/app --include="*.tsx" -A 5 | grep "backgroundColor"
```

**Files to Update**: ~20 button instances

**Expected Impact**: +10% consistency

---

#### Day 3-4: Token Migration
**Goal**: Replace hardcoded values and old token names

**Common Migrations**:
```tsx
// Spacing
padding={16}         → padding="md"
gap="$4"             → gap="md"
gap="$6"             → gap="lg"
paddingHorizontal="$4" → paddingHorizontal="$md"

// Colors
color="$color"       → color="default"
color="$textDark"    → color="$text"
color="$muted"       → color="muted" (as variant)
backgroundColor="$bg" → backgroundColor="$background"
borderColor="$borderColor" → borderColor="$border"

// Sizes
fontSize="$5"        → size="lg" (for Text component)
fontSize="$3"        → size="sm" (for Text component)
```

**Create Migration Script**:
```typescript
// scripts/migrate-tokens.ts
import fs from 'fs'
import path from 'path'
import glob from 'glob'

const migrations = {
  'padding={16}': 'padding="md"',
  'padding={24}': 'padding="lg"',
  'gap="\\$4"': 'gap="md"',
  'gap="\\$6"': 'gap="lg"',
  'color="\\$color"': 'color="default"',
  'backgroundColor="\\$bg"': 'backgroundColor="$background"',
  'borderColor="\\$borderColor"': 'borderColor="$border"',
}

const files = glob.sync('apps/web/**/*.tsx')
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8')
  Object.entries(migrations).forEach(([old, new]) => {
    content = content.replace(new RegExp(old, 'g'), new)
  })
  fs.writeFileSync(file, content)
})

console.log('✅ Token migration complete!')
```

**Run Migration**:
```bash
npm install -D glob
ts-node scripts/migrate-tokens.ts
pnpm check-types
```

**Expected Impact**: +15% consistency

---

#### Day 5: Build Verification

**Checklist**:
- [ ] Type checking passes
- [ ] Build succeeds
- [ ] No runtime errors
- [ ] Components look identical
- [ ] Dark mode works (if applicable)

---

### Week 3: Polish (Low Impact, High Value)

#### Day 1-2: Documentation
**Goal**: Create clear examples and best practices

**Action Items**:
1. **Update README.md** with real-world examples
2. **Create VS Code snippets** for common patterns
3. **Add video walkthrough** (optional, Loom recording)
4. **Update Copilot instructions** with migration notes

**VS Code Snippets** (`.vscode/buttergolf.code-snippets`):
```json
{
  "Button with variant": {
    "prefix": "btn-variant",
    "body": [
      "<Button size=\"${1|sm,md,lg|}\" tone=\"${2|primary,secondary,outline,ghost,success,error|}\">",
      "  $3",
      "</Button>"
    ],
    "description": "Button with size and tone variants"
  },
  "Card with compound components": {
    "prefix": "card-compound",
    "body": [
      "<Card variant=\"${1|elevated,outlined,filled,ghost|}\" padding=\"${2|none,sm,md,lg,xl|}\">",
      "  <Card.Header>",
      "    <Heading level={3}>$3</Heading>",
      "  </Card.Header>",
      "  <Card.Body>",
      "    <Text>$4</Text>",
      "  </Card.Body>",
      "  <Card.Footer align=\"${5|left,center,right|}\">",
      "    <Button>$6</Button>",
      "  </Card.Footer>",
      "</Card>"
    ],
    "description": "Card with compound component pattern"
  },
  "Layout - Column": {
    "prefix": "layout-col",
    "body": [
      "<Column gap=\"${1|xs,sm,md,lg,xl|}\" align=\"${2|start,center,end,stretch|}\">",
      "  $3",
      "</Column>"
    ],
    "description": "Column layout component"
  },
  "Layout - Row": {
    "prefix": "layout-row",
    "body": [
      "<Row gap=\"${1|xs,sm,md,lg,xl|}\" align=\"${2|start,center,end,stretch,baseline|}\" justify=\"${3|start,center,end,between,around,evenly|}\">",
      "  $4",
      "</Row>"
    ],
    "description": "Row layout component"
  }
}
```

---

#### Day 3-4: Component Showcase
**Goal**: Visual reference for developers

**Enhance `theme-test` page**:
```tsx
// Add sections for each component family
export default function ComponentShowcasePage() {
  return (
    <Container maxWidth="lg">
      <Column gap="xl" padding="lg">
        <Heading level={1}>Component Library Showcase</Heading>
        
        {/* Buttons Section */}
        <Column gap="md">
          <Heading level={2}>Buttons</Heading>
          <Row gap="md" wrap>
            <Button size="sm" tone="primary">Small Primary</Button>
            <Button size="md" tone="secondary">Medium Secondary</Button>
            <Button size="lg" tone="outline">Large Outline</Button>
            <Button tone="ghost">Ghost</Button>
            <Button tone="success">Success</Button>
            <Button tone="error">Error</Button>
          </Row>
        </Column>

        {/* Cards Section */}
        <Column gap="md">
          <Heading level={2}>Cards</Heading>
          <Row gap="md" wrap>
            <Card variant="elevated" padding="md" maxWidth={300}>
              <Card.Header>
                <Heading level={4}>Elevated Card</Heading>
              </Card.Header>
              <Card.Body>
                <Text>Card content goes here</Text>
              </Card.Body>
              <Card.Footer>
                <Button size="sm">Action</Button>
              </Card.Footer>
            </Card>
            {/* More card examples... */}
          </Row>
        </Column>

        {/* Typography Section */}
        <Column gap="md">
          <Heading level={2}>Typography</Heading>
          <Column gap="sm">
            <Heading level={1}>Heading 1</Heading>
            <Heading level={2}>Heading 2</Heading>
            <Heading level={3}>Heading 3</Heading>
            <Text size="lg">Large text</Text>
            <Text size="md">Medium text (default)</Text>
            <Text size="sm" color="secondary">Small secondary text</Text>
            <Text size="xs" color="muted">Extra small muted text</Text>
          </Column>
        </Column>

        {/* Add more sections... */}
      </Column>
    </Container>
  )
}
```

---

#### Day 5: Final Review & Celebration

**Final Checklist**:
- [ ] All migrations complete
- [ ] Documentation updated
- [ ] VS Code snippets working
- [ ] Component showcase live
- [ ] Team trained on new patterns
- [ ] Metrics tracked:
  - [ ] Before: 50% consistency
  - [ ] After: 90%+ consistency ✅
  - [ ] Build time unchanged
  - [ ] Zero hardcoded values

**Success Metrics**:
```
✅ 90%+ components use Row/Column (vs 30%)
✅ 90%+ Cards use compound pattern (vs 15%)
✅ 95%+ semantic token usage (vs 65%)
✅ 90%+ Button variant usage (vs 45%)
✅ Zero hardcoded colors or spacing
✅ Consistent patterns across web/mobile
```

---

## 🛠️ Tools & Scripts

### Essential Scripts

**1. Layout Migration Script** (`scripts/migrate-layouts.sh`):
```bash
#!/bin/bash
git checkout -b migration/layout-components
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/<XStack/<Row/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/<\/XStack>/<\/Row>/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/<YStack/<Column/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/<\/YStack>/<\/Column>/g' {} \;
echo "✅ Layout components migrated! Run 'pnpm check-types' next."
```

**2. Find Problem Patterns** (`scripts/audit-patterns.sh`):
```bash
#!/bin/bash
echo "🔍 Auditing component patterns..."
echo ""
echo "📦 Old Card imports:"
grep -r "CardHeader\|CardFooter" apps/web packages/app --include="*.tsx" | wc -l
echo ""
echo "📐 XStack/YStack usage:"
grep -r "XStack\|YStack" apps/web packages/app --include="*.tsx" | wc -l
echo ""
echo "🎨 Hardcoded spacing:"
grep -r "padding={[0-9]" apps/web packages/app --include="*.tsx" | wc -l
echo ""
echo "🎯 Manual button styling:"
grep -r "<Button" apps/web packages/app --include="*.tsx" -A 3 | grep "backgroundColor" | wc -l
```

**3. Prop Mapping Helper** (`scripts/map-props.sh`):
```bash
#!/bin/bash
# Fix common prop name inconsistencies
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/alignItems="center"/align="center"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/alignItems="flex-start"/align="start"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/justifyContent="space-between"/justify="between"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/justifyContent="flex-start"/justify="start"/g' {} \;
```

---

## 📚 Quick Reference

### Component Patterns Cheat Sheet

```tsx
// ✅ CORRECT PATTERNS

// Layout
<Row gap="md" align="center" justify="between">
  <Text>Left</Text>
  <Button>Right</Button>
</Row>

<Column gap="lg" align="stretch" fullWidth>
  <Heading level={2}>Title</Heading>
  <Text>Content</Text>
</Column>

// Cards
<Card variant="elevated" padding="md">
  <Card.Header>
    <Heading level={3}>Title</Heading>
  </Card.Header>
  <Card.Body>
    <Text>Content</Text>
  </Card.Body>
  <Card.Footer align="right">
    <Button>Action</Button>
  </Card.Footer>
</Card>

// Buttons
<Button size="lg" tone="primary" fullWidth>
  Sign Up
</Button>

// Typography
<Text size="md" color="secondary" weight="semibold">
  Important text
</Text>
```

```tsx
// ❌ OLD PATTERNS (to be migrated)

// Layout
<YStack gap="$4" alignItems="center">
  <Text>Content</Text>
</YStack>

// Cards
<Card>
  <CardHeader>Title</CardHeader>
  <CardFooter>Footer</CardFooter>
</Card>

// Buttons
<Button
  size="$4"
  backgroundColor="$primary"
  paddingHorizontal="$4"
>
  Submit
</Button>

// Typography
<Text fontSize="$5" color="$color">
  Text
</Text>
```

---

## 📈 Tracking Progress

### Weekly Metrics Dashboard

Create a simple tracking file (`MIGRATION_PROGRESS.md`):

```markdown
# Migration Progress Tracker

## Week 1
- [x] Layout component migration script created
- [x] 35 files migrated to Row/Column
- [x] Type checking passes
- [ ] All Card components migrated
- [ ] Build verification complete

**Consistency Score**: 50% → 65%

## Week 2
- [ ] Button variant standardization (20 files)
- [ ] Token migration script run
- [ ] Manual token verification
- [ ] Build and test

**Consistency Score**: 65% → 80%

## Week 3
- [ ] Documentation updated
- [ ] VS Code snippets added
- [ ] Component showcase created
- [ ] Team training completed

**Consistency Score**: 80% → 90%+
```

---

## 🎉 Success Criteria

### Definition of Done

**Technical**:
- ✅ `pnpm check-types` passes with zero errors
- ✅ `pnpm build` succeeds on first try
- ✅ `pnpm lint` shows no new issues
- ✅ All tests pass (if applicable)

**Code Quality**:
- ✅ Zero XStack/YStack in new code
- ✅ Zero CardHeader/CardFooter imports
- ✅ Zero hardcoded spacing (padding={16})
- ✅ Zero hardcoded colors (#hex values)
- ✅ 90%+ Button variant usage

**Developer Experience**:
- ✅ VS Code snippets working
- ✅ Documentation clear and complete
- ✅ Component showcase accessible
- ✅ Team understands patterns

**User Experience**:
- ✅ No visual regressions
- ✅ All features working
- ✅ Performance unchanged
- ✅ Responsive design maintained

---

## 💡 Pro Tips

### Before Starting
1. **Create a migration branch**: `git checkout -b migration/component-library`
2. **Commit frequently**: After each file or group of files
3. **Test incrementally**: Don't migrate everything at once
4. **Use type checking**: `pnpm check-types` after each change

### During Migration
1. **Keep a changelog**: Track what you've changed
2. **Screenshot before/after**: Visual regression testing
3. **Ask for help**: If stuck, check existing examples (OnboardingScreen, CategoryButton)
4. **Use search/replace carefully**: Always verify changes

### After Migration
1. **Update team**: Share learnings and new patterns
2. **Create linting rules**: Prevent old patterns from returning
3. **Monitor metrics**: Track consistency improvements
4. **Celebrate**: You've significantly improved the codebase! 🎉

---

## 🆘 Troubleshooting

### Common Issues

**Issue**: Type errors after migration
**Solution**: Check prop name mappings (alignItems → align, justifyContent → justify)

**Issue**: Build fails after script
**Solution**: Run `pnpm clean-install` and rebuild

**Issue**: Components look different
**Solution**: Verify gap values (gap="$4" → gap="md", not automatic)

**Issue**: Dark mode broken
**Solution**: Ensure all colors use semantic tokens ($primary, $text, $background)

---

## 📞 Need Help?

### Resources
- **Full Audit Report**: `COMPONENT_LIBRARY_AUDIT_REPORT.md`
- **Component Documentation**: `packages/ui/README.md`
- **Token Guide**: `packages/config/README.md`
- **Design System**: `DESIGN_SYSTEM_SUMMARY.md`
- **Copilot Instructions**: `.github/copilot-instructions.md`

### Best Practice Examples
- **Mobile**: `apps/mobile/App.tsx` (95% score)
- **Onboarding**: `packages/app/src/features/onboarding/screen.tsx` (perfect example)
- **CategoryButton**: `packages/app/src/components/CategoryButton.tsx` (excellent tokens)

---

**Ready to start? Begin with Week 1, Day 1! 🚀**
