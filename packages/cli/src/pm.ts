import { PasswordManager } from '@pm/core'
import type { PMStorage } from '@pm/core'
import { storage } from './storage'

class PM extends PasswordManager {
  constructor(_storage: PMStorage) {
    super(_storage)
  }
}

export const passwordManager = new PM(storage)
