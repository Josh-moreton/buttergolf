#!/bin/bash

# Component Library Migration - Prop Mapping
# Updates old prop names to new semantic names

set -e

echo "🔄 Mapping old props to new semantic names..."
echo ""

# Step 1: alignItems mappings
echo "🔄 Step 1: Updating alignItems → align..."
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/alignItems="center"/align="center"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/alignItems="flex-start"/align="start"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/alignItems="flex-end"/align="end"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/alignItems="stretch"/align="stretch"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/alignItems="baseline"/align="baseline"/g' {} \;
echo "✅ alignItems → align complete"

# Step 2: justifyContent mappings
echo "🔄 Step 2: Updating justifyContent → justify..."
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/justifyContent="center"/justify="center"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/justifyContent="flex-start"/justify="start"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/justifyContent="flex-end"/justify="end"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/justifyContent="space-between"/justify="between"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/justifyContent="space-around"/justify="around"/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/justifyContent="space-evenly"/justify="evenly"/g' {} \;
echo "✅ justifyContent → justify complete"

# Step 3: flexDirection (should be removed for Row/Column)
echo "🔄 Step 3: Checking for flexDirection (should use Row/Column instead)..."
FLEX_DIR_COUNT=$(grep -r "flexDirection=" apps/web packages/app --include="*.tsx" 2>/dev/null | wc -l)
if [ "$FLEX_DIR_COUNT" -gt 0 ]; then
  echo "⚠️  Found $FLEX_DIR_COUNT instances of flexDirection"
  echo "   These should be replaced with Row (horizontal) or Column (vertical)"
  echo "   Run: grep -r 'flexDirection=' apps/web packages/app --include='*.tsx'"
else
  echo "✅ No flexDirection found (good!)"
fi

# Step 4: flexWrap
echo "🔄 Step 4: Updating flexWrap → wrap..."
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/flexWrap="wrap"/wrap={true}/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/flexWrap="nowrap"/wrap={false}/g' {} \;
echo "✅ flexWrap → wrap complete"

echo ""
echo "✅ Prop mapping complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Run: pnpm check-types"
echo "   2. Review any remaining type errors"
echo "   3. Search for any remaining old props:"
echo "      - grep -r 'alignItems=' apps/web packages/app --include='*.tsx'"
echo "      - grep -r 'justifyContent=' apps/web packages/app --include='*.tsx'"
echo ""
