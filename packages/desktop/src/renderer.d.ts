import type { PM } from '@kennys_wang/pm-core'

interface PasswordManager {
  getList: () => PM[];
  createAccount: (pm: Omit<PM, 'id'>) => void;
}

declare global {
  interface Window {
    pm: PasswordManager
  }
}
