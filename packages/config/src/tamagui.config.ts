import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui, createTokens } from 'tamagui'

// Brand Colors - 10-shade scales for all color families
const brandColors = {
    // Primary Brand (Green) - Golf course inspired
    green50: '#e6f7f0',
    green100: '#b3e5d1',
    green200: '#80d3b2',
    green300: '#4dc193',
    green400: '#26b77f',
    green500: '#13a063', // Primary brand color
    green600: '#0f8c54',
    green700: '#0b6b3f',
    green800: '#084f2e',
    green900: '#053320',

    // Secondary Brand (Amber/Gold) - Premium accent
    amber50: '#fef9e6',
    amber100: '#fceeb3',
    amber200: '#fae380',
    amber300: '#f8d84d',
    amber400: '#f2b705', // Secondary brand color
    amber500: '#d99f04',
    amber600: '#b38403',
    amber700: '#8c6802',
    amber800: '#664c02',
    amber900: '#403001',

    // Neutral (Gray)
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',

    // Info (Blue)
    blue50: '#eff6ff',
    blue100: '#dbeafe',
    blue200: '#bfdbfe',
    blue300: '#93c5fd',
    blue400: '#60a5fa',
    blue500: '#3c50e0',
    blue600: '#2563eb',
    blue700: '#1d4ed8',
    blue800: '#1e40af',
    blue900: '#1e3a8a',

    // Success (Teal)
    teal50: '#e6fffc',
    teal100: '#b3fff5',
    teal200: '#80ffee',
    teal300: '#4dffe7',
    teal400: '#1affe0',
    teal500: '#02aaa4',
    teal600: '#029490',
    teal700: '#017d7a',
    teal800: '#016765',
    teal900: '#015150',

    // Error (Red)
    red50: '#fef2f2',
    red100: '#fee2e2',
    red200: '#fecaca',
    red300: '#fca5a5',
    red400: '#f87171',
    red500: '#ef4444',
    red600: '#dc2626',
    red700: '#b91c1c',
    red800: '#991b1b',
    red900: '#7f1d1d',

    // Utility colors
    white: '#ffffff',
    black: '#000000',
    offWhite: '#fbfbf9',
    cream: '#FFF8E7', // Soft cream/ivory for hero text

    // Vinted-inspired teal (for onboarding)
    vintedTeal: '#357C7B',
    vintedTealHover: '#2d6867',
    vintedTealPress: '#255553',
}

// Create custom tokens with complete design system
const customTokens = createTokens({
    color: {
        ...brandColors,

        // Primary semantic colors
        primary: brandColors.green500,
        primaryLight: brandColors.green100,
        primaryHover: brandColors.green600,
        primaryPress: brandColors.green700,
        primaryFocus: brandColors.green500,

        secondary: brandColors.amber400,
        secondaryLight: brandColors.amber100,
        secondaryHover: brandColors.amber500,
        secondaryPress: brandColors.amber600,
        secondaryFocus: brandColors.amber400,

        success: brandColors.teal500,
        successLight: brandColors.teal100,
        successDark: brandColors.teal700,

        error: brandColors.red600,
        errorLight: brandColors.red100,
        errorDark: brandColors.red700,

        warning: brandColors.amber400,
        warningLight: brandColors.amber100,
        warningDark: brandColors.amber700,

        info: brandColors.blue500,
        infoLight: brandColors.blue100,
        infoDark: brandColors.blue700,

        // Background colors (light theme defaults)
        background: brandColors.offWhite,
        backgroundHover: '#f5f5f2',
        backgroundPress: '#eeeeeb',
        backgroundFocus: '#e8e8e4',
        backgroundStrong: brandColors.white,
        backgroundTransparent: 'rgba(251, 251, 249, 0)',

        // Text colors (light theme defaults)
        text: brandColors.gray900,
        textSecondary: brandColors.gray700,
        textTertiary: brandColors.gray600,
        textMuted: brandColors.gray500,
        textInverse: brandColors.white,

        // Surface colors
        surface: brandColors.white,
        card: '#F6F7FB',
        cardHover: '#eff1f5',

        // Border colors
        border: brandColors.gray300,
        borderHover: brandColors.gray400,
        borderFocus: brandColors.green500,
        borderPress: brandColors.green600,

        // Shadow colors
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowColorHover: 'rgba(0, 0, 0, 0.15)',
        shadowColorPress: 'rgba(0, 0, 0, 0.2)',
        shadowColorFocus: 'rgba(19, 160, 99, 0.3)',

        // Generic color states (light theme defaults)
        color: brandColors.gray900,
        colorHover: brandColors.gray800,
        colorPress: brandColors.gray700,
        colorFocus: brandColors.gray900,
        colorTransparent: 'rgba(17, 24, 39, 0)',

        // Backward compatibility
        bg: brandColors.offWhite,
        bgGray: '#F7F7F7',
        bgCard: '#F6F7FB',
        cardBg: brandColors.white,
        textDark: '#1C274C',
        muted: brandColors.gray500,
        blue: brandColors.blue500,
        blueLight: brandColors.blue300,
        teal: brandColors.teal500,
        red: brandColors.red600,
        cream: brandColors.cream,
    },

    size: {
        ...defaultConfig.tokens.size,
        // Component sizes
        buttonSm: 32,
        buttonMd: 40,
        buttonLg: 48,
        inputSm: 32,
        inputMd: 40,
        inputLg: 48,
        iconSm: 16,
        iconMd: 20,
        iconLg: 24,
        iconXl: 32,
    },

    space: {
        ...defaultConfig.tokens.space,
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        '2xl': 48,
        '3xl': 64,
    },

    radius: {
        ...defaultConfig.tokens.radius,
        xs: 2,
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        '2xl': 24,
        full: 9999,
    },

    zIndex: {
        ...defaultConfig.tokens.zIndex,
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modalBackdrop: 1040,
        modal: 1050,
        popover: 1060,
        tooltip: 1070,
    },
})

// Light theme with semantic token mappings
const lightTheme = {
    // Background colors - reference tokens
    background: '$background',
    backgroundHover: '$backgroundHover',
    backgroundPress: '$backgroundPress',
    backgroundFocus: '$backgroundFocus',
    backgroundStrong: '$backgroundStrong',
    backgroundTransparent: '$backgroundTransparent',

    // Text colors - reference tokens
    color: '$color',
    colorHover: '$colorHover',
    colorPress: '$colorPress',
    colorFocus: '$colorFocus',
    colorTransparent: '$colorTransparent',

    // Semantic colors - reference tokens
    primary: '$primary',
    primaryHover: '$primaryHover',
    primaryPress: '$primaryPress',
    primaryFocus: '$primaryFocus',
    primaryLight: '$primaryLight',

    secondary: '$secondary',
    secondaryHover: '$secondaryHover',
    secondaryPress: '$secondaryPress',
    secondaryFocus: '$secondaryFocus',
    secondaryLight: '$secondaryLight',

    success: '$success',
    successLight: '$successLight',
    successDark: '$successDark',

    error: '$error',
    errorLight: '$errorLight',
    errorDark: '$errorDark',

    warning: '$warning',
    warningLight: '$warningLight',
    warningDark: '$warningDark',

    info: '$info',
    infoLight: '$infoLight',
    infoDark: '$infoDark',

    // Text semantic colors - reference tokens
    text: '$text',
    textSecondary: '$textSecondary',
    textTertiary: '$textTertiary',
    textMuted: '$textMuted',
    textInverse: '$textInverse',

    // Surface colors - reference tokens
    surface: '$surface',
    card: '$card',
    cardHover: '$cardHover',

    // Border colors - reference tokens
    border: '$border',
    borderHover: '$borderHover',
    borderFocus: '$borderFocus',
    borderPress: '$borderPress',

    // Shadow colors - reference tokens
    shadowColor: '$shadowColor',
    shadowColorHover: '$shadowColorHover',
    shadowColorPress: '$shadowColorPress',
    shadowColorFocus: '$shadowColorFocus',

    // Utility colors - reference tokens
    white: '$white',
    cream: '$cream',
}

// Dark theme with semantic token mappings
const darkTheme = {
    // Background colors - override tokens for dark mode
    background: brandColors.gray900,
    backgroundHover: brandColors.gray800,
    backgroundPress: brandColors.gray700,
    backgroundFocus: brandColors.gray800,
    backgroundStrong: brandColors.gray800,
    backgroundTransparent: 'rgba(17, 24, 39, 0)',

    // Text colors - override for dark mode
    color: brandColors.gray50,
    colorHover: brandColors.gray100,
    colorPress: brandColors.white,
    colorFocus: brandColors.gray50,
    colorTransparent: 'rgba(249, 250, 251, 0)',

    // Semantic colors (adjusted for dark mode)
    primary: brandColors.green400,
    primaryHover: brandColors.green500,
    primaryPress: brandColors.green600,
    primaryFocus: brandColors.green400,
    primaryLight: brandColors.green900,

    secondary: brandColors.amber400,
    secondaryHover: brandColors.amber300,
    secondaryPress: brandColors.amber500,
    secondaryFocus: brandColors.amber400,
    secondaryLight: brandColors.amber900,

    success: brandColors.teal400,
    successLight: brandColors.teal900,
    successDark: brandColors.teal300,

    error: brandColors.red500,
    errorLight: brandColors.red900,
    errorDark: brandColors.red400,

    warning: brandColors.amber400,
    warningLight: brandColors.amber900,
    warningDark: brandColors.amber300,

    info: brandColors.blue400,
    infoLight: brandColors.blue900,
    infoDark: brandColors.blue300,

    // Text semantic colors - override for dark mode
    text: brandColors.gray50,
    textSecondary: brandColors.gray300,
    textTertiary: brandColors.gray400,
    textMuted: brandColors.gray500,
    textInverse: brandColors.gray900,

    // Surface colors - override for dark mode
    surface: brandColors.gray800,
    card: brandColors.gray800,
    cardHover: brandColors.gray700,

    // Border colors - override for dark mode
    border: brandColors.gray700,
    borderHover: brandColors.gray600,
    borderFocus: brandColors.green400,
    borderPress: brandColors.green500,

    // Shadow colors - override for dark mode
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowColorHover: 'rgba(0, 0, 0, 0.4)',
    shadowColorPress: 'rgba(0, 0, 0, 0.5)',
    shadowColorFocus: 'rgba(19, 160, 99, 0.3)',

    // Utility colors
    white: brandColors.white,
    cream: brandColors.cream,
}

// Sub-theme for active states (light mode)
// When using <Theme name="active">, it will use light_active in light mode
const light_active = {
    ...lightTheme,
    // Override specific colors for active state
    color: brandColors.green500,
    colorHover: brandColors.green600,
    colorPress: brandColors.green700,
    colorFocus: brandColors.green500,

    // Keep background subtle
    background: brandColors.green50,
    backgroundHover: brandColors.green100,
    backgroundPress: brandColors.green200,
}

// Sub-theme for active states (dark mode)
// When using <Theme name="active">, it will use dark_active in dark mode
const dark_active = {
    ...darkTheme,
    // Override specific colors for active state
    color: brandColors.green400,
    colorHover: brandColors.green300,
    colorPress: brandColors.green500,
    colorFocus: brandColors.green400,

    // Keep background subtle
    background: brandColors.gray800,
    backgroundHover: brandColors.gray700,
    backgroundPress: brandColors.gray600,
}

// Sub-theme for error states (light mode)
const light_error = {
    ...lightTheme,
    color: brandColors.red600,
    colorHover: brandColors.red700,
    colorPress: brandColors.red800,
    background: brandColors.red50,
    backgroundHover: brandColors.red100,
    border: brandColors.red300,
}

// Sub-theme for error states (dark mode)
const dark_error = {
    ...darkTheme,
    color: brandColors.red400,
    colorHover: brandColors.red300,
    colorPress: brandColors.red500,
    background: brandColors.red900,
    backgroundHover: brandColors.red800,
    border: brandColors.red700,
}

// Sub-theme for success states (light mode)
const light_success = {
    ...lightTheme,
    color: brandColors.teal600,
    colorHover: brandColors.teal700,
    colorPress: brandColors.teal800,
    background: brandColors.teal50,
    backgroundHover: brandColors.teal100,
    border: brandColors.teal300,
}

// Sub-theme for success states (dark mode)
const dark_success = {
    ...darkTheme,
    color: brandColors.teal400,
    colorHover: brandColors.teal300,
    colorPress: brandColors.teal500,
    background: brandColors.teal900,
    backgroundHover: brandColors.teal800,
    border: brandColors.teal700,
}

// Sub-theme for warning states (light mode)
const light_warning = {
    ...lightTheme,
    color: brandColors.amber700,
    colorHover: brandColors.amber800,
    colorPress: brandColors.amber900,
    background: brandColors.amber50,
    backgroundHover: brandColors.amber100,
    border: brandColors.amber300,
}

// Sub-theme for warning states (dark mode)
const dark_warning = {
    ...darkTheme,
    color: brandColors.amber300,
    colorHover: brandColors.amber200,
    colorPress: brandColors.amber400,
    background: brandColors.amber900,
    backgroundHover: brandColors.amber800,
    border: brandColors.amber700,
}

export const config = createTamagui({
    ...defaultConfig,
    tokens: customTokens,
    themes: {
        // Base themes
        light: lightTheme,
        dark: darkTheme,

        // Active state sub-themes
        light_active,
        dark_active,

        // Error state sub-themes
        light_error,
        dark_error,

        // Success state sub-themes
        light_success,
        dark_success,

        // Warning state sub-themes
        light_warning,
        dark_warning,
    },
    // Include fonts from defaultConfig
    fonts: defaultConfig.fonts,
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
