import type { TypedFlags } from 'meow'
import { PMFlags } from './types'
import { passwordManager } from './pm'

export async function PMCli(input: string[], flags: TypedFlags<PMFlags> & Record<string, unknown>): Promise<any> {
  if (flags.archive) {
    return await passwordManager.getArchive()
  }

  if (flags.create) {
    const board = input.find(i => i.startsWith('@'))?.slice(1)
    const rest = input.filter(i => !i.startsWith('@'))
    return await passwordManager.create(rest[0], rest[1], board)
  }

  return await passwordManager.getList()
}