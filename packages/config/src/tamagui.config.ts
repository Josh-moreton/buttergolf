import { defaultConfig, tokens as defaultTokens } from '@tamagui/config/v4'
import { createTamagui, createTokens } from 'tamagui'

/**
 * Butter Golf Brand Color Palette
 * These are the foundational colors that define the Butter Golf brand identity
 */
const brandColors = {
  // Primary Brand Colors (Greens)
  green50: '#e6f7f0',
  green100: '#b3e5d1',
  green200: '#80d3b2',
  green300: '#4dc193',
  green400: '#26b77f',
  green500: '#13a063',  // Primary green
  green600: '#0f8c54',
  green700: '#0b6b3f',  // Dark green
  green800: '#084f2e',
  green900: '#053320',

  // Accent Colors (Amber/Gold)
  amber50: '#fef9e6',
  amber100: '#fceeb3',
  amber200: '#fae380',
  amber300: '#f8d84d',
  amber400: '#f2b705',  // Primary amber
  amber500: '#d99f04',
  amber600: '#b38403',
  amber700: '#8c6802',
  amber800: '#664c02',
  amber900: '#403001',

  // Neutrals (Grays)
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

  // Semantic Colors
  blue50: '#eff6ff',
  blue100: '#dbeafe',
  blue200: '#bfdbfe',
  blue300: '#93c5fd',
  blue400: '#60a5fa',
  blue500: '#3c50e0',  // Info/Link color
  blue600: '#2563eb',
  blue700: '#1d4ed8',
  blue800: '#1e40af',
  blue900: '#1e3a8a',

  teal50: '#f0fdfa',
  teal100: '#ccfbf1',
  teal200: '#99f6e4',
  teal300: '#5eead4',
  teal400: '#2dd4bf',
  teal500: '#02aaa4',  // Success indicator
  teal600: '#0d9488',
  teal700: '#0f766e',
  teal800: '#115e59',
  teal900: '#134e4a',

  red50: '#fef2f2',
  red100: '#fee2e2',
  red200: '#fecaca',
  red300: '#fca5a5',
  red400: '#f87171',
  red500: '#ef4444',
  red600: '#dc2626',  // Error/Danger color
  red700: '#b91c1c',
  red800: '#991b1b',
  red900: '#7f1d1d',

  // Special Backgrounds
  offWhite: '#fbfbf9',
  lightGray: '#f7f7f7',
  cardBg: '#f6f7fb',
  white: '#ffffff',
  black: '#000000',
}

/**
 * Semantic Token Definitions
 * These tokens map brand colors to semantic purposes
 */
const customTokens = createTokens({
  ...defaultTokens,
  color: {
    ...brandColors,

    // Backward compatibility tokens for existing code
    blue10: brandColors.blue500,
    blue: brandColors.blue500,
    blueLight: brandColors.blue300,
    teal: brandColors.teal500,
    red: brandColors.red600,
    bg: brandColors.offWhite,
    bgGray: brandColors.lightGray,
    bgCard: brandColors.cardBg,
    textDark: brandColors.gray800,
    muted: brandColors.gray500,

    // Semantic mappings for light theme
    primary: brandColors.green500,
    primaryDark: brandColors.green700,
    primaryLight: brandColors.green300,
    primaryHover: brandColors.green600,
    primaryPress: brandColors.green700,

    secondary: brandColors.amber400,
    secondaryDark: brandColors.amber600,
    secondaryLight: brandColors.amber200,
    secondaryHover: brandColors.amber500,
    secondaryPress: brandColors.amber600,

    accent: brandColors.blue500,
    accentHover: brandColors.blue600,
    accentPress: brandColors.blue700,

    success: brandColors.teal500,
    successLight: brandColors.teal100,
    successDark: brandColors.teal700,

    error: brandColors.red600,
    errorLight: brandColors.red100,
    errorDark: brandColors.red800,

    warning: brandColors.amber400,
    warningLight: brandColors.amber100,
    warningDark: brandColors.amber700,

    info: brandColors.blue500,
    infoLight: brandColors.blue100,
    infoDark: brandColors.blue700,

    // Background colors
    background: brandColors.offWhite,
    backgroundHover: brandColors.lightGray,
    backgroundPress: brandColors.gray100,
    backgroundFocus: brandColors.gray50,

    surface: brandColors.white,
    surfaceHover: brandColors.gray50,
    surfacePress: brandColors.gray100,

    card: brandColors.cardBg,
    cardHover: brandColors.white,

    // Text colors
    text: brandColors.gray900,
    textSecondary: brandColors.gray600,
    textTertiary: brandColors.gray500,
    textMuted: brandColors.gray400,
    textInverse: brandColors.white,

    // Border colors
    border: brandColors.gray200,
    borderHover: brandColors.gray300,
    borderFocus: brandColors.green500,

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  space: {
    ...defaultTokens.space,
    // Additional semantic spacing
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  size: {
    ...defaultTokens.size,
    // Component size tokens
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
  radius: {
    ...defaultTokens.radius,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
  },
  zIndex: {
    ...defaultTokens.zIndex,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
})

/**
 * Theme Definitions
 * Light and dark theme configurations with semantic color mappings
 */
const lightTheme = {
  background: brandColors.offWhite,
  backgroundHover: brandColors.lightGray,
  backgroundPress: brandColors.gray100,
  backgroundFocus: brandColors.gray50,
  backgroundStrong: brandColors.white,
  backgroundTransparent: 'transparent',

  color: brandColors.gray900,
  colorHover: brandColors.gray800,
  colorPress: brandColors.gray900,
  colorFocus: brandColors.gray800,
  colorTransparent: 'transparent',

  borderColor: brandColors.gray200,
  borderColorHover: brandColors.gray300,
  borderColorFocus: brandColors.green500,
  borderColorPress: brandColors.gray400,

  shadowColor: 'rgba(0, 0, 0, 0.1)',
  shadowColorHover: 'rgba(0, 0, 0, 0.15)',
  shadowColorPress: 'rgba(0, 0, 0, 0.2)',
  shadowColorFocus: 'rgba(0, 0, 0, 0.15)',

  primary: brandColors.green500,
  primaryHover: brandColors.green600,
  primaryPress: brandColors.green700,
  primaryFocus: brandColors.green500,

  secondary: brandColors.amber400,
  secondaryHover: brandColors.amber500,
  secondaryPress: brandColors.amber600,
  secondaryFocus: brandColors.amber400,
}

const darkTheme = {
  background: brandColors.gray900,
  backgroundHover: brandColors.gray800,
  backgroundPress: brandColors.gray700,
  backgroundFocus: brandColors.gray800,
  backgroundStrong: brandColors.black,
  backgroundTransparent: 'transparent',

  color: brandColors.gray50,
  colorHover: brandColors.gray100,
  colorPress: brandColors.white,
  colorFocus: brandColors.gray100,
  colorTransparent: 'transparent',

  borderColor: brandColors.gray700,
  borderColorHover: brandColors.gray600,
  borderColorFocus: brandColors.green500,
  borderColorPress: brandColors.gray500,

  shadowColor: 'rgba(0, 0, 0, 0.3)',
  shadowColorHover: 'rgba(0, 0, 0, 0.4)',
  shadowColorPress: 'rgba(0, 0, 0, 0.5)',
  shadowColorFocus: 'rgba(0, 0, 0, 0.4)',

  primary: brandColors.green400,
  primaryHover: brandColors.green300,
  primaryPress: brandColors.green500,
  primaryFocus: brandColors.green400,

  secondary: brandColors.amber400,
  secondaryHover: brandColors.amber300,
  secondaryPress: brandColors.amber500,
  secondaryFocus: brandColors.amber400,
}

export const config = createTamagui({
  ...defaultConfig,
  tokens: customTokens,
  themes: {
    ...defaultConfig.themes,
    light: lightTheme,
    dark: darkTheme,
  },
  media: {
    ...defaultConfig.media,
    // Add custom media queries
    xs: { maxWidth: 660 },
    gtXs: { minWidth: 660 + 1 },
    short: { maxHeight: 700 },
    tall: { minHeight: 700 + 1 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  },
  settings: {
    ...defaultConfig.settings,
    // Allow both longhand and shorthand props for flexibility
    onlyAllowShorthands: false,
    // Enable animations by default
    shouldAddPrefersColorThemes: true,
    themeClassNameOnRoot: true,
    // Dev-specific optimizations
    ...(process.env.NODE_ENV === 'development' && {
      fastSchemeChange: true,
    }),
  },
})

export type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
