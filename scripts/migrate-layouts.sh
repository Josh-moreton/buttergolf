#!/bin/bash

# Component Library Migration - Layout Components
# Migrates XStack → Row, YStack → Column

set -e

echo "🔄 Starting layout component migration..."
echo ""

# Create migration branch
echo "📝 Creating migration branch..."
git checkout -b migration/layout-components

# Backup list of files to be changed
echo "📋 Creating backup list..."
find apps/web packages/app -name "*.tsx" -type f | grep -E "(XStack|YStack)" > /tmp/buttergolf-migration-files.txt || true

# Count files to migrate
FILE_COUNT=$(find apps/web packages/app -name "*.tsx" -type f -exec grep -l "XStack\|YStack" {} \; 2>/dev/null | wc -l)
echo "📊 Found $FILE_COUNT files to migrate"
echo ""

# Step 1: Replace XStack with Row
echo "🔄 Step 1: Replacing XStack with Row..."
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/<XStack/<Row/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/<\/XStack>/<\/Row>/g' {} \;
echo "✅ XStack → Row complete"

# Step 2: Replace YStack with Column
echo "🔄 Step 2: Replacing YStack with Column..."
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/<YStack/<Column/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/<\/YStack>/<\/Column>/g' {} \;
echo "✅ YStack → Column complete"

# Step 3: Update imports - multiple patterns
echo "🔄 Step 3: Updating imports..."
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/import { XStack, YStack/import { Row, Column/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/import { YStack, XStack/import { Row, Column/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/XStack, YStack/Row, Column/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/YStack, XStack/Row, Column/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/, XStack/, Row/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/, YStack/, Column/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/XStack,/Row,/g' {} \;
find apps/web packages/app -name "*.tsx" -type f -exec sed -i '' 's/YStack,/Column,/g' {} \;
echo "✅ Import updates complete"

echo ""
echo "✅ Layout component migration complete!"
echo ""
echo "⚠️  IMPORTANT: Manual verification required:"
echo "   1. Run 'pnpm check-types' to check for errors"
echo "   2. Search for old prop names that need updating:"
echo "      - alignItems → align"
echo "      - justifyContent → justify"
echo "      - flexDirection → (remove, handled by Row/Column)"
echo "   3. Update gap values if needed:"
echo "      - gap=\"\$4\" → gap=\"md\""
echo "      - gap=\"\$6\" → gap=\"lg\""
echo ""
echo "📝 Next steps:"
echo "   1. Run: ./scripts/map-props.sh (to fix common props)"
echo "   2. Run: pnpm check-types"
echo "   3. Run: pnpm build"
echo "   4. Test: pnpm dev:web"
echo "   5. Commit: git add . && git commit -m 'refactor: migrate to Row/Column layout components'"
echo ""
