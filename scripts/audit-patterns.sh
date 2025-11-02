#!/bin/bash

# Component Library Audit - Pattern Finder
# Identifies old patterns that need migration

set -e

echo "🔍 Auditing component patterns..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Layout components
echo "📐 Layout Component Usage:"
XSTACK_COUNT=$(grep -r "<XStack\|XStack>" apps/web packages/app --include="*.tsx" 2>/dev/null | wc -l)
YSTACK_COUNT=$(grep -r "<YStack\|YStack>" apps/web packages/app --include="*.tsx" 2>/dev/null | wc -l)
ROW_COUNT=$(grep -r "<Row\|Row>" apps/web packages/app --include="*.tsx" 2>/dev/null | wc -l)
COLUMN_COUNT=$(grep -r "<Column\|Column>" apps/web packages/app --include="*.tsx" 2>/dev/null | wc -l)

echo "   ❌ XStack usage: $XSTACK_COUNT instances"
echo "   ❌ YStack usage: $YSTACK_COUNT instances"
echo "   ✅ Row usage: $ROW_COUNT instances"
echo "   ✅ Column usage: $COLUMN_COUNT instances"

LAYOUT_OLD=$((XSTACK_COUNT + YSTACK_COUNT))
LAYOUT_NEW=$((ROW_COUNT + COLUMN_COUNT))
LAYOUT_TOTAL=$((LAYOUT_OLD + LAYOUT_NEW))

if [ "$LAYOUT_TOTAL" -gt 0 ]; then
  LAYOUT_PERCENT=$((LAYOUT_NEW * 100 / LAYOUT_TOTAL))
  echo "   📊 New pattern adoption: $LAYOUT_PERCENT%"
else
  echo "   📊 New pattern adoption: N/A"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 2. Card components
echo "📦 Card Component Usage:"
OLD_CARD_HEADER=$(grep -r "CardHeader" apps/web packages/app --include="*.tsx" 2>/dev/null | wc -l)
OLD_CARD_FOOTER=$(grep -r "CardFooter" apps/web packages/app --include="*.tsx" 2>/dev/null | wc -l)
NEW_CARD_HEADER=$(grep -r "Card\.Header" apps/web packages/app --include="*.tsx" 2>/dev/null | wc -l)
NEW_CARD_FOOTER=$(grep -r "Card\.Footer" apps/web packages/app --include="*.tsx" 2>/dev/null | wc -l)

echo "   ❌ Old CardHeader imports: $OLD_CARD_HEADER instances"
echo "   ❌ Old CardFooter imports: $OLD_CARD_FOOTER instances"
echo "   ✅ New Card.Header usage: $NEW_CARD_HEADER instances"
echo "   ✅ New Card.Footer usage: $NEW_CARD_FOOTER instances"

CARD_OLD=$((OLD_CARD_HEADER + OLD_CARD_FOOTER))
CARD_NEW=$((NEW_CARD_HEADER + NEW_CARD_FOOTER))
CARD_TOTAL=$((CARD_OLD + CARD_NEW))

if [ "$CARD_TOTAL" -gt 0 ]; then
  CARD_PERCENT=$((CARD_NEW * 100 / CARD_TOTAL))
  echo "   📊 New pattern adoption: $CARD_PERCENT%"
else
  echo "   📊 New pattern adoption: N/A"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 3. Spacing patterns
echo "📏 Spacing Patterns:"
HARDCODED_PADDING=$(grep -r "padding={[0-9]" apps/web packages/app --include="*.tsx" 2>/dev/null | wc -l)
HARDCODED_MARGIN=$(grep -r "margin={[0-9]" apps/web packages/app --include="*.tsx" 2>/dev/null | wc -l)
HARDCODED_GAP=$(grep -r "gap={[0-9]" apps/web packages/app --include="*.tsx" 2>/dev/null | wc -l)

echo "   ⚠️  Hardcoded padding: $HARDCODED_PADDING instances"
echo "   ⚠️  Hardcoded margin: $HARDCODED_MARGIN instances"
echo "   ⚠️  Hardcoded gap: $HARDCODED_GAP instances"

SPACING_TOTAL=$((HARDCODED_PADDING + HARDCODED_MARGIN + HARDCODED_GAP))
echo "   📊 Total hardcoded spacing: $SPACING_TOTAL"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 4. Button patterns
echo "🔘 Button Patterns:"
BUTTON_MANUAL_STYLE=$(grep -r "<Button" apps/web packages/app --include="*.tsx" -A 3 2>/dev/null | grep -E "backgroundColor|paddingHorizontal" | wc -l)
BUTTON_VARIANT=$(grep -r "tone=" apps/web packages/app --include="*.tsx" 2>/dev/null | wc -l)

echo "   ⚠️  Manual button styling: $BUTTON_MANUAL_STYLE instances"
echo "   ✅ Button variant usage: $BUTTON_VARIANT instances"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 5. Old prop names
echo "🏷️  Old Prop Names:"
ALIGN_ITEMS=$(grep -r "alignItems=" apps/web packages/app --include="*.tsx" 2>/dev/null | wc -l)
JUSTIFY_CONTENT=$(grep -r "justifyContent=" apps/web packages/app --include="*.tsx" 2>/dev/null | wc -l)
FLEX_DIRECTION=$(grep -r "flexDirection=" apps/web packages/app --include="*.tsx" 2>/dev/null | wc -l)

echo "   ⚠️  alignItems usage: $ALIGN_ITEMS instances"
echo "   ⚠️  justifyContent usage: $JUSTIFY_CONTENT instances"
echo "   ⚠️  flexDirection usage: $FLEX_DIRECTION instances"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 6. Overall score
echo "📊 Overall Migration Progress:"

TOTAL_OLD=$((LAYOUT_OLD + CARD_OLD + SPACING_TOTAL + BUTTON_MANUAL_STYLE))
TOTAL_NEW=$((LAYOUT_NEW + CARD_NEW + BUTTON_VARIANT))
GRAND_TOTAL=$((TOTAL_OLD + TOTAL_NEW))

if [ "$GRAND_TOTAL" -gt 0 ]; then
  OVERALL_PERCENT=$((TOTAL_NEW * 100 / GRAND_TOTAL))
  echo "   New pattern adoption: $OVERALL_PERCENT%"
  
  if [ "$OVERALL_PERCENT" -lt 50 ]; then
    echo "   Status: ⚠️  Needs significant improvement"
    echo "   Recommendation: Start with layout migration (./scripts/migrate-layouts.sh)"
  elif [ "$OVERALL_PERCENT" -lt 80 ]; then
    echo "   Status: 🔄 Making progress"
    echo "   Recommendation: Continue with card and button migrations"
  else
    echo "   Status: ✅ Excellent adoption!"
    echo "   Recommendation: Polish remaining edge cases"
  fi
else
  echo "   Status: N/A (no components found)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 7. Detailed file list
echo "📋 Top 5 Files Needing Attention:"
echo ""

echo "Files with most XStack/YStack:"
grep -r "XStack\|YStack" apps/web packages/app --include="*.tsx" -l 2>/dev/null | head -5 | while read file; do
  count=$(grep -c "XStack\|YStack" "$file" 2>/dev/null)
  echo "   $count instances - $file"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "✅ Audit complete!"
echo ""
echo "📝 Recommended next steps:"
if [ "$LAYOUT_OLD" -gt 0 ]; then
  echo "   1. Run: ./scripts/migrate-layouts.sh"
fi
if [ "$ALIGN_ITEMS" -gt 0 ] || [ "$JUSTIFY_CONTENT" -gt 0 ]; then
  echo "   2. Run: ./scripts/map-props.sh"
fi
if [ "$CARD_OLD" -gt 0 ]; then
  echo "   3. Manually migrate Card components (see MIGRATION_ACTION_PLAN.md)"
fi
if [ "$BUTTON_MANUAL_STYLE" -gt 10 ]; then
  echo "   4. Standardize Button variants (see MIGRATION_ACTION_PLAN.md)"
fi
echo ""
