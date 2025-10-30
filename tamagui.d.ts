import type { AppConfig } from '@buttergolf/ui'

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export {}
