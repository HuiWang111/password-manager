import { PasswordManager } from '@pm/core'
import type { PMStorage } from '@pm/core'
import { storage } from './storage'
// import { AES } from 'crypto-js'

class PM extends PasswordManager {
  constructor(
    storage: PMStorage,
    encoder?: ((pwd: string) => string),
    decoder?: ((pwd: string) => string)
  ) {
    super(storage, encoder, decoder)
  }
}

export const passwordManager = new PM(
  storage,
  // (pwd: string, key: string) => AES.encrypt(pwd, key).toString()
)
