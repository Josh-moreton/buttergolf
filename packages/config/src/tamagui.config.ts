import { defaultConfig, tokens as defaultTokens } from '@tamagui/config/v4'
import { themes as defaultThemes } from '@tamagui/themes'
import { createTamagui } from 'tamagui'

// Custom Butter Golf colors as tokens
// These provide semantic color names for consistent theming across the app
const butterGolfColors = {
    // Primary brand colors
    green700: '#0b6b3f',
    green500: '#13a063',
    amber400: '#f2b705',

    // Background colors
    bg: '#fbfbf9',
    bgGray: '#F7F7F7',
    bgCard: '#F6F7FB',
    cardBg: '#ffffff',

    // Text colors
    text: '#0f1720',
    textDark: '#1C274C',
    muted: '#6b7280',

    // Accent colors
    blue: '#3C50E0',
    blueLight: '#93C5FD',
    teal: '#02AAA4',
    red: '#DC2626',

    // Neutral colors (for placeholder cards, borders, etc.)
    gray100: '#dfe6e9',
    gray300: '#b2bec3',
    gray400: '#D1D5DB',
    gray500: '#636e72',
    gray700: '#2d3436',

    // Utility colors
    accentBlue: '#74b9ff',
    accentPurple: '#a29bfe',
}

// Golf Marketplace Theme
// A polished MVP theme using green (golf courses) and amber (premium) accents
// Light theme has cream backgrounds, dark theme has forest-inspired darks
const golfMarketplaceThemes = {
    light: {
        ...defaultThemes.light,
        // Primary colors - Golf green
        color1: '#f8faf7',        // Lightest green tint
        color2: '#f2f6f0',
        color3: '#e5f0e0',
        color4: '#d1e6c8',
        color5: '#b8d9a9',
        color6: '#9acc85',
        color7: '#6fb84d',
        color8: '#4a9e2e',
        color9: '#13a063',        // Brand green
        color10: '#0b6b3f',       // Darker brand green
        color11: '#084a2b',
        color12: '#042918',       // Darkest green

        // Backgrounds
        background: '#fbfbf9',    // Cream background
        backgroundHover: '#f5f5f2',
        backgroundPress: '#eeeeeb',
        backgroundFocus: '#e8e8e4',
        backgroundStrong: '#ffffff',
        backgroundTransparent: 'rgba(251, 251, 249, 0)',

        // Color semantics
        color: '#042918',          // Text color
        colorHover: '#084a2b',
        colorPress: '#0b6b3f',
        colorFocus: '#13a063',
        colorTransparent: 'rgba(4, 41, 24, 0)',

        // Borders
        borderColor: '#e5e7e4',
        borderColorHover: '#d1d3d0',
        borderColorFocus: '#9acc85',
        borderColorPress: '#6fb84d',

        // Shadows (subtle, professional)
        shadowColor: 'rgba(0, 0, 0, 0.04)',
        shadowColorHover: 'rgba(0, 0, 0, 0.08)',
        shadowColorPress: 'rgba(0, 0, 0, 0.12)',
        shadowColorFocus: 'rgba(19, 160, 99, 0.2)',
    },

    dark: {
        ...defaultThemes.dark,
        // Primary colors - Forest dark with green accents
        color1: '#0a1410',        // Deep forest dark
        color2: '#0f1f18',
        color3: '#142920',
        color4: '#1a3428',
        color5: '#204030',
        color6: '#2d5442',
        color7: '#3d6d56',
        color8: '#4e8669',
        color9: '#13a063',        // Brand green (same as light)
        color10: '#1bc77f',       // Brighter in dark mode
        color11: '#4dd99d',
        color12: '#e5f0e0',       // Light text

        // Backgrounds
        background: '#0a1410',    // Deep forest
        backgroundHover: '#0f1f18',
        backgroundPress: '#142920',
        backgroundFocus: '#1a3428',
        backgroundStrong: '#1a3428',
        backgroundTransparent: 'rgba(10, 20, 16, 0)',

        // Color semantics
        color: '#e5f0e0',          // Light text
        colorHover: '#f2f6f0',
        colorPress: '#f8faf7',
        colorFocus: '#4dd99d',
        colorTransparent: 'rgba(229, 240, 224, 0)',

        // Borders
        borderColor: '#2d5442',
        borderColorHover: '#3d6d56',
        borderColorFocus: '#4e8669',
        borderColorPress: '#13a063',

        // Shadows (more pronounced in dark mode)
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowColorHover: 'rgba(0, 0, 0, 0.4)',
        shadowColorPress: 'rgba(0, 0, 0, 0.5)',
        shadowColorFocus: 'rgba(19, 160, 99, 0.3)',
    },
}

export const config = createTamagui({
    ...defaultConfig,
    themes: {
        ...golfMarketplaceThemes,
        // Add accent themes for components (buttons, cards, etc.)
        light_green: golfMarketplaceThemes.light,
        dark_green: golfMarketplaceThemes.dark,
        light_amber: {
            ...golfMarketplaceThemes.light,
            color9: '#f2b705',    // Amber accent
            color10: '#d9a304',
            colorFocus: '#f2b705',
        },
        dark_amber: {
            ...golfMarketplaceThemes.dark,
            color9: '#f2b705',
            color10: '#ffc629',
            colorFocus: '#ffc629',
        },
    },
    tokens: {
        ...defaultTokens,
        color: {
            ...defaultTokens.color,
            ...butterGolfColors,
        },
    },
    settings: {
        ...defaultConfig.settings,
        onlyAllowShorthands: false,
    },
})

export type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
