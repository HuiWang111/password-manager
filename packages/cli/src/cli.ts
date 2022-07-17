import type { TypedFlags } from 'meow'
import pkg from '../package.json' assert { type: 'json' };
import { PMFlags } from './types'
import { passwordManager } from './pm'
import { help } from './help'

export function PMCli(input: string[], flags: TypedFlags<PMFlags> & Record<string, unknown>): any {
  if (flags.archive) {
    return passwordManager.getArchive()
  }

  if (flags.create) {
    const board = input.find(i => i.startsWith('@'))?.slice(1)
    const rest = input.filter(i => !i.startsWith('@'))
    return passwordManager.create(rest[0], rest[1], board)
  }
  
  if (flags.delete) {
    return passwordManager.delete(input)
  }

  if (flags.copy) {
    // TODO: 
    return
  }

  if (flags.show) {
    return passwordManager.getList(input)
  }

  if (flags.remark) {
    return passwordManager.remark(input[0], input[1])
  }

  if (flags.help) {
    return console.info(help)
  }

  if (flags.find) {
    return passwordManager.find(input[0])
  }

  if (flags.move) {
    const board = input.find(i => i.startsWith('@'))?.slice(1)
    const rest = input.filter(i => !i.startsWith('@'))
    return passwordManager.move(rest[0], board)
  }

  if (flags.archive) {
    return passwordManager.getArchive()
  }

  if (flags.edit) {
    return passwordManager.edit(input[0], input[1])
  }

  if (flags.restore) {
    return passwordManager.restore(input)
  }

  if (flags.version) {
    return console.info(pkg.version)
  }

  return passwordManager.getList()
}