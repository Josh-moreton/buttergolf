#!/bin/bash
# =============================================================================
# Dependency Validation Script
# =============================================================================
# Validates that the lockfile is consistent and no unexpected upgrades occur.
# Run this before committing changes to ensure CI will pass.
#
# Usage: pnpm run deps:check
# =============================================================================

set -e

echo "🔍 Checking dependency consistency..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track if any checks fail
FAILED=0

# -----------------------------------------------------------------------------
# 1. Verify lockfile is up to date (no changes needed)
# -----------------------------------------------------------------------------
echo "📦 Verifying lockfile consistency..."
if pnpm install --frozen-lockfile --ignore-scripts > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Lockfile is consistent"
else
    echo -e "${RED}✗${NC} Lockfile is out of sync. Run 'pnpm install' and commit the lockfile."
    FAILED=1
fi

# -----------------------------------------------------------------------------
# 2. Check for version consistency across workspaces
# -----------------------------------------------------------------------------
echo ""
echo "🔄 Checking version consistency across workspaces..."
if npx check-dependency-version-consistency . 2>/dev/null; then
    echo -e "${GREEN}✓${NC} All workspace dependencies are consistent"
else
    echo -e "${YELLOW}⚠${NC} Some dependency versions may be inconsistent (check output above)"
fi

# -----------------------------------------------------------------------------
# 3. Check for duplicate packages in node_modules
# -----------------------------------------------------------------------------
echo ""
echo "📋 Checking for duplicate packages..."
REACT_COUNT=$(find node_modules -name "package.json" -path "*/react/package.json" 2>/dev/null | wc -l)
if [ "$REACT_COUNT" -gt 1 ]; then
    echo -e "${RED}✗${NC} Multiple React versions detected ($REACT_COUNT instances)"
    echo "   Run 'pnpm dedupe' to resolve"
    FAILED=1
else
    echo -e "${GREEN}✓${NC} No duplicate React versions"
fi

# -----------------------------------------------------------------------------
# 4. Verify critical version constraints
# -----------------------------------------------------------------------------
echo ""
echo "🔐 Verifying critical version constraints..."

# Check React version
REACT_VERSION=$(node -p "require('./node_modules/react/package.json').version" 2>/dev/null || echo "not found")
if [ "$REACT_VERSION" = "19.1.0" ]; then
    echo -e "${GREEN}✓${NC} React version: $REACT_VERSION"
else
    echo -e "${RED}✗${NC} React version mismatch: expected 19.1.0, got $REACT_VERSION"
    FAILED=1
fi

# Check React Native version (if installed - may not be in web-only CI)
if [ -d "node_modules/react-native" ]; then
    RN_VERSION=$(node -p "require('./node_modules/react-native/package.json').version" 2>/dev/null || echo "not found")
    if [[ "$RN_VERSION" == 0.81.* ]]; then
        echo -e "${GREEN}✓${NC} React Native version: $RN_VERSION (0.81.x required for Expo 54)"
    else
        echo -e "${RED}✗${NC} React Native version mismatch: expected 0.81.x, got $RN_VERSION"
        FAILED=1
    fi
fi

# Check Tamagui version
if [ -d "node_modules/tamagui" ]; then
    TAMAGUI_VERSION=$(node -p "require('./node_modules/tamagui/package.json').version" 2>/dev/null || echo "not found")
    if [ "$TAMAGUI_VERSION" = "1.135.7" ]; then
        echo -e "${GREEN}✓${NC} Tamagui version: $TAMAGUI_VERSION"
    else
        echo -e "${RED}✗${NC} Tamagui version mismatch: expected 1.135.7, got $TAMAGUI_VERSION"
        FAILED=1
    fi
fi

# -----------------------------------------------------------------------------
# 5. Summary
# -----------------------------------------------------------------------------
echo ""
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  All dependency checks passed!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    exit 0
else
    echo -e "${RED}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${RED}  Some dependency checks failed. Please fix the issues above.${NC}"
    echo -e "${RED}═══════════════════════════════════════════════════════════════${NC}"
    exit 1
fi
