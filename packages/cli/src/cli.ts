import type { TypedFlags } from 'meow'
import pkg from '../package.json' assert { type: 'json' };
import { PMFlags } from './types'
import { passwordManager } from './pm'
import { help } from './help'
import { renderGrid } from './utils'

export function PMCli(input: string[], flags: TypedFlags<PMFlags> & Record<string, unknown>): any {
  if (flags.archive) {
    return passwordManager.getArchive()
  }

  if (flags.create) {
    const board = input.find(i => i.startsWith('@'))?.slice(1)
    const rest = input.filter(i => !i.startsWith('@'))
    // TODO: 目前创建账号的时候board仅支持一个单词，如果需要多个单词可以创建后使用move命令
    return passwordManager.create(rest[0], rest[1], board, rest.slice(2).join(' '))
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
    return passwordManager.remark(input[0], input.slice(1).join(' '))
  }

  if (flags.help) {
    return console.info(help)
  }

  if (flags.find) {
    return passwordManager.find(input[0])
  }

  if (flags.move) {
    const id = input.find(i => i.startsWith('@'))?.slice(1)
    const rest = input.filter(i => !i.startsWith('@'))
    return passwordManager.move(id || '', rest.join(' '))
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

  const list = passwordManager.getList()
  return renderGrid(list)
}