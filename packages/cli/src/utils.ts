import type { PathLike } from 'fs'
import { accessSync } from 'fs'
import ConsoleGrid from 'console-grid'
import { PM } from '@kennys_wang/pm-core'

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

export function groupBy(list?: Record<string, string>[], key?: string): Record<string, Record<string, string>[]> {
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

export function renderGrid(rows: PM[]): void {
  const grid = new ConsoleGrid()
  // @ts-ignore
  const grouped = groupBy(rows, 'board')
  
  for (const key in grouped) {
    console.info(`@${key} (${grouped[key].length})`)
    const data = {
      columns: [
        { id: 'id', name: 'ID', type: 'string' },
        { id: 'account', name: 'Account', type: 'string' },
        { id: 'password', name: 'Password', type: 'string' },
        { id: 'board', name: 'Board', type: 'string' },
        { id: 'remark', name: 'Remark', type: 'string' }
      ],
      rows: grouped[key]
    }
  
    grid.render(data)
    console.info('')
  }
}
