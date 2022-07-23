import type { TypedFlags } from 'meow'
import type { PMFlags, PMConfig } from './types'
import { PM } from './pm'
import { help } from './help'
import { renderGrid } from './utils'
import clipboard from 'clipboardy'
import CryptoJS from 'crypto-js'

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

export function PMCli(
    input: string[],
    flags: TypedFlags<PMFlags> & Record<string, unknown>,
    version: string,
    defaultConfig: PMConfig): any {
  const passwordManager = new PM(defaultConfig, pwdEncoder, pwdDecoder)

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
    return console.info(version)
  }

  if (flags.clean) {
    return passwordManager.clean()
  }

  const list = passwordManager.getList()
  return renderGrid(list)
}