import type { PathLike } from 'fs'
import { accessSync } from 'fs'

export function isExists(path: PathLike, mode?: number): boolean {
  try {
    accessSync(path, mode)
    return true
  } catch (e) {
    return false
  }
}

export function formatStringify(data: Record<string, unknown> | any[]): string {
  return JSON.stringify(data, null, 4)
}