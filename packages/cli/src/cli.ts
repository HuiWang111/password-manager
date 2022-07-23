import type { TypedFlags } from 'meow'
import type { PMFlags, PMConfig } from './types'
import { PM } from './pm'
import { help } from './help'
import clipboard from 'clipboardy'
import CryptoJS from 'crypto-js'
import { render } from './render'

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

export async function PMCli(
    input: string[],
    flags: TypedFlags<PMFlags> & Record<string, unknown>,
    version: string,
    defaultConfig: PMConfig): Promise<void> {
  const passwordManager = new PM(defaultConfig, pwdEncoder, pwdDecoder)

  if (flags.create) {
    const board = input.find(i => i.startsWith('@'))?.slice(1)
    const rest = input.filter(i => !i.startsWith('@'))
    const [account, password, ...remarks] = rest
    // TODO: 目前创建账号的时候board仅支持一个单词，如果需要多个单词可以创建后使用move命令
    passwordManager.create(account, password, board, remarks.join(' '))
    return render.successCreate(account)
  }
  
  if (flags.delete) {
    passwordManager.delete(input)
    return render.successDelete(input.join(', '))
  }

  if (flags.copy) {
    const id = input[0]
    const item = passwordManager.get(id, '')
    clipboard.writeSync(item.password)
    return render.successCopy(item.account)
  }

  if (flags.show) {
    const list = passwordManager.getList(input, '')
    return render.grid(list)
  }

  if (flags.remark) {
    const [id, ...remarks] = input
    const remark = remarks.join(' ')
    passwordManager.remark(id, remark)
    return render.successRemark(id, remark)
  }

  if (flags.help) {
    return console.info(help)
  }

  if (flags.find) {
    const list = passwordManager.find(input[0])
    return render.grid(list)
  }

  if (flags.move) {
    const id = input.find(i => i.startsWith('@'))?.slice(1)
    const board = input.filter(i => !i.startsWith('@')).join(' ')
    passwordManager.move(id || '', board)
    return render.successMove(id!, board)
  }
  
  if (flags.archive) {
    const archiveList = passwordManager.getArchive()
    return render.grid(archiveList, {
      beforeWarning: 'Follwing accounts has been archived'
    })
  }

  if (flags.edit) {
    const [id, password] = input
    passwordManager.edit(id, password)
    return render.successEdit(id)
  }

  if (flags.restore) {
    const ids = [...input]
    passwordManager.restore(ids)
    return render.successRestore(ids)
  }

  if (flags.version) {
    return console.info(version)
  }

  if (flags.clean) {
    passwordManager.clean()
    return render.successClean()
  }

  await render.logo()
  const list = passwordManager.getList()
  return render.grid(list)
}