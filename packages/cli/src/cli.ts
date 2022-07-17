import type { TypedFlags } from 'meow'
import pkg from '../package.json' assert { type: 'json' };
import { PMFlags } from './types'
import { passwordManager } from './pm'
import { help } from './help'
import { renderGrid } from './utils'
import clipboard from 'clipboardy'

export function PMCli(input: string[], flags: TypedFlags<PMFlags> & Record<string, unknown>): any {
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
    const item = passwordManager.get(input[0], '')
    clipboard.writeSync(item.password)
    return console.info(`Successful copy password of account: ${item.id}`)
  }

  if (flags.show) {
    const list = passwordManager.getList(input, '')
    return renderGrid(list)
  }

  if (flags.remark) {
    return passwordManager.remark(input[0], input.slice(1).join(' '))
  }

  if (flags.help) {
    return console.info(help)
  }

  if (flags.find) {
    const list = passwordManager.find(input[0])
    return renderGrid(list)
  }

  if (flags.move) {
    const id = input.find(i => i.startsWith('@'))?.slice(1)
    const rest = input.filter(i => !i.startsWith('@'))
    return passwordManager.move(id || '', rest.join(' '))
  }
  
  if (flags.archive) {
    const archiveList = passwordManager.getArchive()
    return renderGrid(archiveList)
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

  if (flags.clean) {
    return passwordManager.clean()
  }

  const list = passwordManager.getList()
  return renderGrid(list)
}