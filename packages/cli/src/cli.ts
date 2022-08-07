
import type { TypedFlags } from 'meow'
import clipboard from 'clipboardy'
import type { PMConfig } from '@kennys_wang/pm-node-service'
import { createPM } from '@kennys_wang/pm-node-service'
import type { PMFlags } from './types'
import { help } from './help'
import { render } from './render'

export async function PMCli(
    input: string[],
    flags: TypedFlags<PMFlags> & Record<string, unknown>,
    version: string,
    defaultConfig: { default: PMConfig }): Promise<void> {
  const passwordManager = createPM(defaultConfig, (path: string) => {
    render.invalidCustomAppDir(path)
    process.exit(1)
  })

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