"use client";

import { Row, Button } from "@buttergolf/ui";

interface BuySellToggleProps {
    activeMode: "buying" | "selling";
    onModeChange: (mode: "buying" | "selling") => void;
}

/**
 * BuySellToggle Component
 *
 * Two-button toggle for switching between Buying and Selling modes.
 * Matches Figma mockup with pill-shaped buttons and proper active/inactive states.
 */
export function BuySellToggle({ activeMode, onModeChange }: BuySellToggleProps) {
    return (
        <Row
            width="100%"
            justifyContent="center"
            gap="$lg"
            paddingVertical="$lg"
            paddingHorizontal="$md"
            backgroundColor="$pureWhite"
        >
            {/* Buying Button */}
            <Button
                size="lg"
                onPress={() => onModeChange("buying")}
                backgroundColor={activeMode === "buying" ? "$primary" : "$vanillaCream"}
                color={activeMode === "buying" ? "$textInverse" : "$vanillaCream"}
                borderRadius="$full"
                paddingVertical="$4"
                width="25%"
                minWidth={280}
                fontSize="$5"
                fontWeight="500"
                hoverStyle={{
                    backgroundColor: activeMode === "buying" ? "$primaryHover" : "$vanillaCreamHover",
                    opacity: 0.9,
                }}
                pressStyle={{
                    backgroundColor: activeMode === "buying" ? "$primaryPress" : "$vanillaCreamPress",
                    scale: 0.98,
                }}
            >
                Buying
            </Button>

            {/* Selling Button */}
            <Button
                size="lg"
                onPress={() => onModeChange("selling")}
                backgroundColor={activeMode === "selling" ? "$primary" : "$cloudMist"}
                color={activeMode === "selling" ? "$textInverse" : "$ironstone"}
                borderRadius="$full"
                paddingVertical="$4"
                width="25%"
                minWidth={280}
                fontSize="$5"
                fontWeight="500"
                hoverStyle={{
                    backgroundColor: activeMode === "selling" ? "$primaryHover" : "$cloudMistHover",
                    opacity: 0.9,
                }}
                pressStyle={{
                    backgroundColor: activeMode === "selling" ? "$primaryPress" : "$cloudMistPress",
                    scale: 0.98,
                }}
            >
                Selling
            </Button>
        </Row>
    );
}
