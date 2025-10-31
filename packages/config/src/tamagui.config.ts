import { defaultConfig, tokens as defaultTokens } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'

// Custom Butter Golf colors as tokens
const butterGolfColors = {
    green700: '#0b6b3f',
    green500: '#13a063',
    amber400: '#f2b705',
    bg: '#fbfbf9',
    cardBg: '#ffffff',
    text: '#0f1720',
    muted: '#6b7280',
}

export const config = createTamagui({
    ...defaultConfig,
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
    interface TamaguiCustomConfig extends AppConfig { }
}

export default config
