import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui, createTokens, createFont } from 'tamagui'

/**
 * Convert hex color to Display P3 color space CSS format.
 * This ensures colors render consistently across all devices,
 * matching the designer's intent on wide-gamut displays.
 */
function hexToP3(hex: string): string {
    const cleanHex = hex.replace('#', '')
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)

    const rNorm = (r / 255).toFixed(3)
    const gNorm = (g / 255).toFixed(3)
    const bNorm = (b / 255).toFixed(3)

    return `color(display-p3 ${rNorm} ${gNorm} ${bNorm})`
}

/**
 * Convert rgba color to Display P3 color space CSS format with alpha.
 */
function rgbaToP3(r: number, g: number, b: number, a: number): string {
    const rNorm = (r / 255).toFixed(3)
    const gNorm = (g / 255).toFixed(3)
    const bNorm = (b / 255).toFixed(3)

    return `color(display-p3 ${rNorm} ${gNorm} ${bNorm} / ${a})`
}

// Urbanist font for Pure Butter brand identity
const urbanistFace = {
    normal: { normal: 'Urbanist, system-ui', italic: 'Urbanist, system-ui' },
    bold: { normal: 'Urbanist, system-ui', italic: 'Urbanist, system-ui' },
    100: { normal: 'Urbanist, system-ui', italic: 'Urbanist, system-ui' },
    200: { normal: 'Urbanist, system-ui', italic: 'Urbanist, system-ui' },
    300: { normal: 'Urbanist, system-ui', italic: 'Urbanist, system-ui' },
    400: { normal: 'Urbanist, system-ui', italic: 'Urbanist, system-ui' },
    500: { normal: 'Urbanist, system-ui', italic: 'Urbanist, system-ui' },
    600: { normal: 'Urbanist, system-ui', italic: 'Urbanist, system-ui' },
    700: { normal: 'Urbanist, system-ui', italic: 'Urbanist, system-ui' },
    800: { normal: 'Urbanist, system-ui', italic: 'Urbanist, system-ui' },
    900: { normal: 'Urbanist, system-ui', italic: 'Urbanist, system-ui' },
}

const headingFont = createFont({
    family: 'Urbanist, -apple-system, system-ui, BlinkMacSystemFont, sans-serif',
    size: {
        1: 12,
        2: 14,
        3: 16,
        4: 18,
        5: 20,
        6: 24,
        7: 28,
        8: 32,
        9: 40,
        10: 48,
        11: 56,
        12: 64,
        13: 72,
        14: 80,
        15: 96,
        16: 112,
    },
    lineHeight: {
        1: 16,
        2: 18,
        3: 20,
        4: 22,
        5: 24,
        6: 28,
        7: 32,
        8: 38,
        9: 46,
        10: 54,
        11: 62,
        12: 70,
        13: 78,
        14: 86,
        15: 104,
        16: 120,
    },
    weight: {
        1: '100',
        2: '200',
        3: '300',
        4: '400',
        5: '500',
        6: '600',
        7: '700',
        8: '800',
        9: '900',
    },
    letterSpacing: {
        1: 0,
        2: -0.5,
        3: -1,
        4: -1.5,
        5: -2,
    },
    face: urbanistFace,
})

const bodyFont = createFont({
    family: 'Urbanist, -apple-system, system-ui, BlinkMacSystemFont, sans-serif',
    size: {
        1: 11,
        2: 12,
        3: 13,
        4: 14,
        5: 15,
        6: 16,
        7: 18,
        8: 20,
        9: 22,
        10: 24,
        11: 28,
        12: 32,
        13: 40,
        14: 48,
        15: 56,
        16: 64,
    },
    lineHeight: {
        1: 15,
        2: 16,
        3: 18,
        4: 20,
        5: 22,
        6: 24,
        7: 26,
        8: 28,
        9: 30,
        10: 32,
        11: 36,
        12: 40,
        13: 48,
        14: 56,
        15: 64,
        16: 72,
    },
    weight: {
        1: '100',
        2: '200',
        3: '300',
        4: '400', // Book weight for body text
        5: '500',
        6: '600',
        7: '700',
        8: '800',
        9: '900',
    },
    letterSpacing: {
        1: 0,
        2: -0.25,
        3: -0.5,
        4: -0.75,
        5: -1,
    },
    face: urbanistFace,
})

// Brand Colors - 10-shade scales for all color families
// Using Display P3 color space to match modern displays and designer's intent
const brandColors = {
    // Primary Brand (Butter Orange) - Pure Butter heritage brand
    butter50: hexToP3('#FFF9ED'),
    butter100: hexToP3('#FFF3D6'),
    butter200: hexToP3('#FFECBD'),
    butter300: hexToP3('#FFE38A'),
    butter400: hexToP3('#E25F2F'), // Primary brand color (Butter Orange) - RGB(226, 95, 47)
    butter500: hexToP3('#D2553A'), // Darker/more saturated - for hover states
    butter600: hexToP3('#B8442F'), // Even darker - for press states
    butter700: hexToP3('#9A3824'), // Dark - for text on light backgrounds
    butter800: hexToP3('#7C2D1D'),
    butter900: hexToP3('#5E2316'),

    // Secondary Brand (Navy) - Modern contrast accent
    navy50: hexToP3('#E8EDF3'),
    navy100: hexToP3('#C7D3E0'),
    navy200: hexToP3('#95AABF'),
    navy300: hexToP3('#6482A0'),
    navy400: hexToP3('#3B5673'),
    navy500: hexToP3('#1A2E44'), // Secondary brand color (Navy)
    navy600: hexToP3('#0F1F30'),
    navy700: hexToP3('#0A1520'),
    navy800: hexToP3('#050B10'),
    navy900: hexToP3('#020508'),

    // Neutral (Gray)
    gray50: hexToP3('#f9fafb'),
    gray100: hexToP3('#f3f4f6'),
    gray200: hexToP3('#e5e7eb'),
    gray300: hexToP3('#d1d5db'),
    gray400: hexToP3('#9ca3af'),
    gray500: hexToP3('#6b7280'),
    gray600: hexToP3('#4b5563'),
    gray700: hexToP3('#374151'),
    gray800: hexToP3('#1f2937'),
    gray900: hexToP3('#111827'),

    // Info (Blue)
    blue50: hexToP3('#eff6ff'),
    blue100: hexToP3('#dbeafe'),
    blue200: hexToP3('#bfdbfe'),
    blue300: hexToP3('#93c5fd'),
    blue400: hexToP3('#60a5fa'),
    blue500: hexToP3('#3c50e0'),
    blue600: hexToP3('#2563eb'),
    blue700: hexToP3('#1d4ed8'),
    blue800: hexToP3('#1e40af'),
    blue900: hexToP3('#1e3a8a'),

    // Success (Teal)
    teal50: hexToP3('#e6fffc'),
    teal100: hexToP3('#b3fff5'),
    teal200: hexToP3('#80ffee'),
    teal300: hexToP3('#4dffe7'),
    teal400: hexToP3('#1affe0'),
    teal500: hexToP3('#02aaa4'),
    teal600: hexToP3('#029490'),
    teal700: hexToP3('#017d7a'),
    teal800: hexToP3('#016765'),
    teal900: hexToP3('#015150'),

    // Error (Red)
    red50: hexToP3('#fef2f2'),
    red100: hexToP3('#fee2e2'),
    red200: hexToP3('#fecaca'),
    red300: hexToP3('#fca5a5'),
    red400: hexToP3('#f87171'),
    red500: hexToP3('#ef4444'),
    red600: hexToP3('#dc2626'),
    red700: hexToP3('#b91c1c'),
    red800: hexToP3('#991b1b'),
    red900: hexToP3('#7f1d1d'),

    // Utility colors
    white: hexToP3('#ffffff'),
    black: hexToP3('#000000'),
    offWhite: hexToP3('#fbfbf9'), // Legacy
    cream: hexToP3('#FEFAD6'), // Pure Butter cream background
    creamDark: hexToP3('#FFF8E7'), // Slightly darker cream for accents
    charcoal: hexToP3('#1E1E1E'), // Warm charcoal for text

    // Vinted-inspired teal (for onboarding)
    vintedTeal: hexToP3('#357C7B'),
    vintedTealHover: hexToP3('#2d6867'),
    vintedTealPress: hexToP3('#255553'),
}

// Create custom tokens with complete design system
const customTokens = createTokens({
    color: {
        ...brandColors,

        // Primary semantic colors (Pure Butter theme)
        primary: brandColors.butter400,
        primaryLight: brandColors.butter100,
        primaryHover: brandColors.butter500,
        primaryPress: brandColors.butter700,
        primaryFocus: brandColors.butter400,

        secondary: brandColors.navy500,
        secondaryLight: brandColors.navy100,
        secondaryHover: brandColors.navy600,
        secondaryPress: brandColors.navy700,
        secondaryFocus: brandColors.navy500,

        success: brandColors.teal500,
        successLight: brandColors.teal100,
        successDark: brandColors.teal700,

        error: brandColors.red600,
        errorLight: brandColors.red100,
        errorDark: brandColors.red700,

        warning: brandColors.butter500,
        warningLight: brandColors.butter100,
        warningDark: brandColors.butter700,

        info: brandColors.blue500,
        infoLight: brandColors.blue100,
        infoDark: brandColors.blue700,

        // Background colors (light theme defaults - white base with cream accents)
        background: brandColors.white,
        backgroundHover: hexToP3('#F5F5F5'),
        backgroundPress: hexToP3('#EBEBEB'),
        backgroundFocus: hexToP3('#E0E0E0'),
        backgroundStrong: brandColors.cream,
        backgroundTransparent: rgbaToP3(255, 255, 255, 0),

        // Text colors (light theme defaults - warm charcoal)
        text: brandColors.charcoal,
        textSecondary: hexToP3('#4A4A4A'),
        textTertiary: brandColors.gray600,
        textMuted: brandColors.gray500,
        textInverse: brandColors.white,

        // Surface colors (cream background, white cards)
        surface: brandColors.cream,
        card: brandColors.white,
        cardHover: hexToP3('#F5F5F5'),

        // Border colors (Pure Butter theme)
        border: brandColors.gray300,
        borderHover: brandColors.gray400,
        borderFocus: brandColors.butter400,
        borderPress: brandColors.butter500,

        // Shadow colors (softer, vintage feel)
        shadowColor: rgbaToP3(0, 0, 0, 0.08),
        shadowColorHover: rgbaToP3(0, 0, 0, 0.12),
        shadowColorPress: rgbaToP3(0, 0, 0, 0.16),
        shadowColorFocus: rgbaToP3(226, 95, 47, 0.25), // butter tint

        // Inverse overlays for elements sitting on the brand header background
        inverseSurface: rgbaToP3(255, 255, 255, 0.2),
        inverseSurfaceHover: rgbaToP3(255, 255, 255, 0.3),
        inverseSurfacePress: rgbaToP3(255, 255, 255, 0.38),
        inverseBorder: rgbaToP3(255, 255, 255, 0.4),
        inverseBorderHover: rgbaToP3(255, 255, 255, 0.56),
        inverseBorderPress: rgbaToP3(255, 255, 255, 0.72),

        // Generic color states (light theme defaults)
        color: brandColors.charcoal,
        colorHover: brandColors.gray800,
        colorPress: brandColors.gray700,
        colorFocus: brandColors.charcoal,
        colorTransparent: rgbaToP3(30, 30, 30, 0),

        // Backward compatibility
        bg: brandColors.cream,
        bgGray: hexToP3('#F7F7F7'),
        bgCard: hexToP3('#F6F7FB'),
        cardBg: brandColors.white,
        textDark: brandColors.navy500,
        muted: brandColors.gray500,
        blue: brandColors.blue500,
        blueLight: brandColors.blue300,
        teal: brandColors.teal500,
        red: brandColors.red600,
        cream: brandColors.cream,
        creamDark: brandColors.creamDark,
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
        xs: 3,
        sm: 6,
        md: 10,
        lg: 14,
        xl: 18,
        '2xl': 26,
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

    inverseSurface: '$inverseSurface',
    inverseSurfaceHover: '$inverseSurfaceHover',
    inverseSurfacePress: '$inverseSurfacePress',
    inverseBorder: '$inverseBorder',
    inverseBorderHover: '$inverseBorderHover',
    inverseBorderPress: '$inverseBorderPress',

    // Utility colors - reference tokens
    white: '$white',
    cream: '$cream',
}

// Dark theme with semantic token mappings (Navy becomes dominant)
const darkTheme = {
    // Background colors - override tokens for dark mode (Navy)
    background: brandColors.navy900,
    backgroundHover: brandColors.navy800,
    backgroundPress: brandColors.navy700,
    backgroundFocus: brandColors.navy800,
    backgroundStrong: brandColors.navy800,
    backgroundTransparent: rgbaToP3(2, 5, 8, 0),

    // Text colors - override for dark mode
    color: brandColors.gray50,
    colorHover: brandColors.gray100,
    colorPress: brandColors.white,
    colorFocus: brandColors.gray50,
    colorTransparent: rgbaToP3(249, 250, 251, 0),

    // Semantic colors (adjusted for dark mode - lighter butter for contrast)
    primary: brandColors.butter300,
    primaryHover: brandColors.butter400,
    primaryPress: brandColors.butter500,
    primaryFocus: brandColors.butter300,
    primaryLight: brandColors.butter900,

    secondary: brandColors.navy400,
    secondaryHover: brandColors.navy300,
    secondaryPress: brandColors.navy500,
    secondaryFocus: brandColors.navy400,
    secondaryLight: brandColors.navy800,

    success: brandColors.teal400,
    successLight: brandColors.teal900,
    successDark: brandColors.teal300,

    error: brandColors.red500,
    errorLight: brandColors.red900,
    errorDark: brandColors.red400,

    warning: brandColors.butter400,
    warningLight: brandColors.butter900,
    warningDark: brandColors.butter300,

    info: brandColors.blue400,
    infoLight: brandColors.blue900,
    infoDark: brandColors.blue300,

    // Text semantic colors - override for dark mode
    text: brandColors.gray50,
    textSecondary: brandColors.gray300,
    textTertiary: brandColors.gray400,
    textMuted: brandColors.gray500,
    textInverse: brandColors.gray900,

    // Surface colors - override for dark mode (Navy surfaces)
    surface: brandColors.navy800,
    card: brandColors.navy800,
    cardHover: brandColors.navy700,

    // Border colors - override for dark mode
    border: brandColors.navy700,
    borderHover: brandColors.navy600,
    borderFocus: brandColors.butter300,
    borderPress: brandColors.butter400,

    // Shadow colors - override for dark mode
    shadowColor: rgbaToP3(0, 0, 0, 0.3),
    shadowColorHover: rgbaToP3(0, 0, 0, 0.4),
    shadowColorPress: rgbaToP3(0, 0, 0, 0.5),
    shadowColorFocus: rgbaToP3(226, 95, 47, 0.3), // butter tint

    inverseSurface: rgbaToP3(255, 255, 255, 0.14),
    inverseSurfaceHover: rgbaToP3(255, 255, 255, 0.22),
    inverseSurfacePress: rgbaToP3(255, 255, 255, 0.32),
    inverseBorder: rgbaToP3(255, 255, 255, 0.3),
    inverseBorderHover: rgbaToP3(255, 255, 255, 0.45),
    inverseBorderPress: rgbaToP3(255, 255, 255, 0.6),

    // Utility colors
    white: brandColors.white,
    cream: brandColors.cream,
}

// Sub-theme for active states (light mode)
// When using <Theme name="active">, it will use light_active in light mode
const light_active = {
    ...lightTheme,
    // Override specific colors for active state (Butter)
    color: brandColors.butter400,
    colorHover: brandColors.butter500,
    colorPress: brandColors.butter700,
    colorFocus: brandColors.butter400,

    // Keep background subtle
    background: brandColors.butter50,
    backgroundHover: brandColors.butter100,
    backgroundPress: brandColors.butter200,
}

// Sub-theme for active states (dark mode)
// When using <Theme name="active">, it will use dark_active in dark mode
const dark_active = {
    ...darkTheme,
    // Override specific colors for active state (Butter)
    color: brandColors.butter300,
    colorHover: brandColors.butter200,
    colorPress: brandColors.butter400,
    colorFocus: brandColors.butter300,

    // Keep background subtle
    background: brandColors.navy800,
    backgroundHover: brandColors.navy700,
    backgroundPress: brandColors.navy600,
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
    color: brandColors.butter700,
    colorHover: brandColors.butter800,
    colorPress: brandColors.butter900,
    background: brandColors.butter50,
    backgroundHover: brandColors.butter100,
    border: brandColors.butter300,
}

// Sub-theme for warning states (dark mode)
const dark_warning = {
    ...darkTheme,
    color: brandColors.butter300,
    colorHover: brandColors.butter200,
    colorPress: brandColors.butter400,
    background: brandColors.butter900,
    backgroundHover: brandColors.butter800,
    border: brandColors.butter700,
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
    // Urbanist fonts for Pure Butter brand
    fonts: {
        heading: headingFont,
        body: bodyFont,
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
