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

export function formatStringify(data: Record<string, any> | any[]): string {
  return JSON.stringify(data, null, 4)
}

export function groupBy(list?: Record<string, any>[], key?: string): Record<string, Record<string, any>[]> {
  if (!list || !list.length || !key) {
    return {}
  }

  const result: Record<string, Record<string, string>[]> = {}
  list.forEach(item => {
    if (key in item) {
      const field = item[key]
      if (!(field in result)) {
        result[field] = []
      }
      result[field].push(item)
    }
  })

  return result
}
