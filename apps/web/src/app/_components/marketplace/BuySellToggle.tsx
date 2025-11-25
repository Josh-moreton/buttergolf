"use client";

import { Row } from "@buttergolf/ui";

interface BuySellToggleProps {
    activeMode: "buying" | "selling";
    onModeChange: (mode: "buying" | "selling") => void;
}

/**
 * BuySellToggle Component
 *
 * Two-button toggle for switching between Buying and Selling modes.
 * Matches Figma mockup with pill-shaped buttons and proper active/inactive states.
 * 
 * Active (Spiced Clementine):
 * - Background: #F45314
 * - Border: 1px #F04300
 * - Drop shadow: 0 1 5 0 rgba(0,0,0,0.25)
 * - Inner shadow: inset 0 2 2 0 #FF7E4C
 * 
 * Inactive (White/Cream):
 * - Background: linear-gradient(#FFFFFF, #FFFEF9)
 * - Border: 1px linear-gradient(#FAFAFA 94.51%, #FFFCE7)
 * - Drop shadow: 0 1 5 0 rgba(0,0,0,0.10)
 */
export function BuySellToggle({ activeMode, onModeChange }: BuySellToggleProps) {
    // Active button styles (Spiced Clementine)
    const activeStyles: React.CSSProperties = {
        background: "#F45314",
        border: "1px solid #F04300",
        boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.25), inset 0px 2px 2px 0px #FF7E4C",
        color: "#FFFAD2", // Vanilla Cream text
    };

    // Inactive button styles (White gradient)
    const inactiveStyles: React.CSSProperties = {
        background: "linear-gradient(180deg, #FFFFFF 0%, #FFFEF9 100%)",
        border: "1px solid #FAFAFA",
        boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.10)",
        color: "#323232", // Ironstone text
    };

    const buttonBaseStyles: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "9999px",
        paddingTop: "16px",
        paddingBottom: "16px",
        width: "25%",
        minWidth: "280px",
        fontWeight: 500,
        fontSize: "16px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontFamily: "inherit",
    };

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
            <button
                onClick={() => onModeChange("buying")}
                style={{
                    ...buttonBaseStyles,
                    ...(activeMode === "buying" ? activeStyles : inactiveStyles),
                }}
            >
                Buying
            </button>

            {/* Selling Button */}
            <button
                onClick={() => onModeChange("selling")}
                style={{
                    ...buttonBaseStyles,
                    ...(activeMode === "selling" ? activeStyles : inactiveStyles),
                }}
            >
                Selling
            </button>
        </Row>
    );
}
