import type { PathLike } from 'fs'
import { accessSync } from 'fs'
import CryptoJS from 'crypto-js'
import { PM } from './pm'
import type { PMConfig } from './types'

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

export function isExists(path: PathLike, mode?: number): boolean {
  try {
    accessSync(path, mode)
    return true
  } catch (e) {
    return false
  }
}

export function formatStringify(data: Record<string, any> | any[]): string {
  return JSON.stringify(data, null, 4)
}

export function createPM(
    defaultConfig: { default: PMConfig },
    invalidCustomAppDirCallback?: (path: string) => void,
    shouldEncrypt = true): PM {
  return new PM(
    defaultConfig,
    invalidCustomAppDirCallback,
    shouldEncrypt ? pwdEncoder : undefined,
    shouldEncrypt ? pwdDecoder : undefined)
}