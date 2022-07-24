import { PasswordManager } from '@kennys_wang/pm-core'
import type { PMConfig } from './types'
import { Storage } from './storage'

export class PM extends PasswordManager {
  constructor(
    defaultConfig: PMConfig,
    invalidCustomAppDirCallback?: (path: string) => void,
    encoder?: ((pwd: string) => string),
    decoder?: ((pwd: string) => string)
  ) {
    const storage = new Storage(defaultConfig, invalidCustomAppDirCallback)
    super(storage, encoder, decoder)
  }
}
