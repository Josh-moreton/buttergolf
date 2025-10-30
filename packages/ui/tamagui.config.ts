import { shorthands } from '@tamagui/shorthands'
import { themes, tokens } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'

export const config = createTamagui({
    themes,
    tokens,
    shorthands,
})

export type AppConfig = typeof config

declare module 'tamagui' {
    interface TamaguiCustomConfig extends AppConfig { }
}

export default config
