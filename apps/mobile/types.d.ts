import { config } from '@buttergolf/ui'

export type Conf = typeof config

declare module '@buttergolf/ui' {
  interface TamaguiCustomConfig extends Conf {}
}
