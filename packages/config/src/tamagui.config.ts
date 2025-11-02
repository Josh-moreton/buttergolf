import { defaultConfig, tokens as defaultTokens } from '@tamagui/config/v4'
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

export const config = createTamagui({
    ...defaultConfig,
    tokens: {
        ...defaultTokens,
        color: {
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
    interface TamaguiCustomConfig extends AppConfig { }
}

export default config
