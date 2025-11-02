#!/bin/bash

# Component Library Migration - Token Update
# Migrates old token names to new semantic tokens

set -e

echo "🎨 Starting token migration..."
echo ""

# Create migration branch if not already on one
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != migration/* ]]; then
  echo "📝 Creating migration branch..."
  git checkout -b migration/token-update
fi

echo "🔄 Migrating tokens..."
echo ""

# Step 1: Spacing tokens
echo "📏 Step 1: Migrating spacing tokens..."
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/padding={4}/padding="xs"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/padding={8}/padding="sm"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/padding={16}/padding="md"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/padding={24}/padding="lg"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/padding={32}/padding="xl"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/paddingHorizontal={16}/paddingHorizontal="md"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/paddingVertical={16}/paddingVertical="md"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/margin={16}/margin="md"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/gap={16}/gap="md"/g' {} \;
echo "✅ Spacing tokens updated"

# Step 2: Gap tokens (string format)
echo "🔄 Step 2: Migrating gap tokens..."
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/gap="\$2"/gap="sm"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/gap="\$3"/gap="sm"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/gap="\$4"/gap="md"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/gap="\$5"/gap="lg"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/gap="\$6"/gap="lg"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/gap="\$8"/gap="xl"/g' {} \;
echo "✅ Gap tokens updated"

# Step 3: Color tokens (Text component)
echo "🎨 Step 3: Migrating color tokens..."
# Note: Some of these might need manual verification due to context
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/color="\$color"/color="default"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/color="\$textDark"/color="$text"/g' {} \;
# Keep $muted as-is (backward compatible)
# Keep $primary, $error, $success as-is (semantic)
echo "✅ Color tokens updated"

# Step 4: Background tokens
echo "🖼️  Step 4: Migrating background tokens..."
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/backgroundColor="\$bg"/backgroundColor="$background"/g' {} \;
# bgGray, bgCard kept for backward compatibility
echo "✅ Background tokens updated"

# Step 5: Border tokens
echo "🖼️  Step 5: Migrating border tokens..."
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/borderColor="\$borderColor"/borderColor="$border"/g' {} \;
echo "✅ Border tokens updated"

# Step 6: Size tokens (Button component)
echo "📏 Step 6: Migrating size tokens..."
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/size="\$3"/size="sm"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/size="\$4"/size="md"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/size="\$5"/size="lg"/g' {} \;
echo "✅ Size tokens updated"

echo ""
echo "✅ Token migration complete!"
echo ""
echo "⚠️  IMPORTANT: Review these changes carefully:"
echo "   - Some color tokens may need manual verification"
echo "   - Test all components visually"
echo "   - Check dark mode if enabled"
echo ""
echo "📝 Next steps:"
echo "   1. Run: pnpm check-types"
echo "   2. Run: pnpm build"
echo "   3. Test: pnpm dev:web"
echo "   4. Review: git diff"
echo "   5. Commit: git add . && git commit -m 'refactor: migrate to semantic tokens'"
echo ""
