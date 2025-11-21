#!/bin/bash
# =============================================================================
# Safe Dependency Upgrade Script
# =============================================================================
# Provides a controlled workflow for upgrading dependencies safely.
#
# Usage:
#   pnpm run deps:upgrade              # Interactive mode
#   pnpm run deps:upgrade -- --tier2   # Upgrade tier 2 (patch) dependencies
#   pnpm run deps:upgrade -- --all     # Check all available updates
#   pnpm run deps:upgrade -- --expo    # Expo upgrade workflow
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  ButterGolf Dependency Upgrade Tool${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# -----------------------------------------------------------------------------
# Parse arguments
# -----------------------------------------------------------------------------
MODE="interactive"
for arg in "$@"; do
    case $arg in
        --tier2)
            MODE="tier2"
            ;;
        --all)
            MODE="all"
            ;;
        --expo)
            MODE="expo"
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --tier2    Upgrade tier 2 (patch-safe) dependencies only"
            echo "  --all      Show all available updates"
            echo "  --expo     Run Expo-specific upgrade workflow"
            echo "  --help     Show this help message"
            echo ""
            exit 0
            ;;
    esac
done

# -----------------------------------------------------------------------------
# Mode: Show all available updates
# -----------------------------------------------------------------------------
if [ "$MODE" = "all" ]; then
    echo -e "${BLUE}Checking for available updates...${NC}"
    echo ""

    echo -e "${YELLOW}📦 Outdated packages:${NC}"
    pnpm outdated --recursive 2>/dev/null || echo "All packages are up to date!"

    echo ""
    echo -e "${YELLOW}To upgrade a specific package:${NC}"
    echo "  pnpm update <package-name> --latest"
    echo ""
    echo -e "${YELLOW}To upgrade all packages in catalog, edit:${NC}"
    echo "  pnpm-workspace.yaml"
    echo ""
    exit 0
fi

# -----------------------------------------------------------------------------
# Mode: Upgrade tier 2 (patch-safe) dependencies
# -----------------------------------------------------------------------------
if [ "$MODE" = "tier2" ]; then
    echo -e "${BLUE}Upgrading tier 2 (patch-safe) dependencies...${NC}"
    echo ""

    # Update within tilde ranges (patches only)
    pnpm update --recursive

    # Regenerate lockfile
    pnpm install

    echo ""
    echo -e "${GREEN}✓${NC} Tier 2 dependencies updated"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Run: pnpm run deps:check"
    echo "  2. Run: pnpm run check-types"
    echo "  3. Run: pnpm run build"
    echo "  4. Test your application"
    echo "  5. Commit changes: git add pnpm-lock.yaml && git commit -m 'chore(deps): update patch dependencies'"
    echo ""
    exit 0
fi

# -----------------------------------------------------------------------------
# Mode: Expo upgrade workflow
# -----------------------------------------------------------------------------
if [ "$MODE" = "expo" ]; then
    echo -e "${RED}⚠️  EXPO UPGRADE WORKFLOW${NC}"
    echo ""
    echo "Expo upgrades are complex because they require coordinated updates of:"
    echo "  - expo"
    echo "  - react-native (specific version per Expo SDK)"
    echo "  - expo-* packages"
    echo "  - @react-native-* packages"
    echo ""
    echo -e "${YELLOW}Steps to upgrade Expo:${NC}"
    echo ""
    echo "1. Check compatibility matrix:"
    echo "   https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/"
    echo ""
    echo "2. Run Expo's upgrade tool (from apps/mobile):"
    echo "   cd apps/mobile && npx expo install expo@latest"
    echo ""
    echo "3. Update React Native to compatible version in pnpm-workspace.yaml:"
    echo "   - Expo 54 → React Native 0.81.x"
    echo "   - Expo 55 → React Native 0.82.x (check docs)"
    echo ""
    echo "4. Update all expo-* packages:"
    echo "   cd apps/mobile && npx expo install --fix"
    echo ""
    echo "5. Update pnpm-workspace.yaml catalog with new versions"
    echo ""
    echo "6. Run full validation:"
    echo "   pnpm install && pnpm run deps:check && pnpm run build"
    echo ""
    exit 0
fi

# -----------------------------------------------------------------------------
# Mode: Interactive
# -----------------------------------------------------------------------------
echo "Select an upgrade strategy:"
echo ""
echo -e "  ${GREEN}1)${NC} Check available updates (safe, no changes)"
echo -e "  ${GREEN}2)${NC} Upgrade tier 2 dependencies (patches only)"
echo -e "  ${GREEN}3)${NC} Expo SDK upgrade workflow"
echo -e "  ${GREEN}4)${NC} Exit"
echo ""
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        exec "$0" --all
        ;;
    2)
        exec "$0" --tier2
        ;;
    3)
        exec "$0" --expo
        ;;
    4|*)
        echo "Exiting."
        exit 0
        ;;
esac
