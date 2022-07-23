import { PasswordManager } from '@kennys_wang/pm-core'
import type { PMConfig } from './types'
import { Storage } from './storage'

export class PM extends PasswordManager {
  constructor(
    defaultConfig: PMConfig,
    encoder?: ((pwd: string) => string),
    decoder?: ((pwd: string) => string)
  ) {
    const storage = new Storage(defaultConfig)
    super(storage, encoder, decoder)
  }
}
