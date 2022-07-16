import { PasswordManager } from '@pm/core'
import type { PMStorage } from '@pm/core'
import { storage } from './storage'
import CryptoJS from 'crypto-js'

const { AES, enc } = CryptoJS
const SECRET_KEY = 'the secret key for password manager'

function pwdEncoder(pwd: string): string {
  return AES
    .encrypt(pwd, SECRET_KEY)
    .toString()
}

function pwdDecoder(pwd: string): string {
  return AES
    .decrypt(pwd, SECRET_KEY)
    .toString(enc.Utf8)
}

class PM extends PasswordManager {
  constructor(
    storage: PMStorage,
    encoder?: ((pwd: string) => string),
    decoder?: ((pwd: string) => string)
  ) {
    super(storage, encoder, decoder)
  }
}

export const passwordManager = new PM(storage, pwdEncoder, pwdDecoder)
