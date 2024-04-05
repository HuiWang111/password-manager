import { PM, PMStorage } from './types'
import { DEFAULT_BOARD } from './contants'

const defaultMask = '******'
const privateBoard = '__private__'

export class PasswordManager<T extends PMStorage = PMStorage> {
  constructor(
    private _storage: T,
    private _encoder?: (pwd: string) => string,
    private _decoder?: (pwd: string) => string
  ) {}

  /**
   * @param pwd 密码
   * @param isEncode 是否是加密，true是加密处理，false是解密处理
   */
  private _transform(pwd: string, isEncode = true) {
    if (isEncode && this._encoder) {
      return this._encoder(pwd)
    } else if (!isEncode && this._decoder) {
      return this._decoder(pwd)
    }
    return pwd
  }

  private async _generateId(ls?: PM[]): Promise<string> {
    const list = ls ?? await this._storage.getList()
    const ids = list.map(item => parseInt(item.id, 10))
    const max = ids.length > 0 ? Math.max.apply(null, ids) : 0

    return String(max + 1)
  }

  private async _generateArchiveId(ls?: PM[]): Promise<string> {
    const list = ls ?? await this._storage.getArchive()
    const ids = list.map(item => parseInt(item.id, 10))
    const max = ids.length > 0 ? Math.max.apply(null, ids) : 0

    return String(max + 1)
  }

  private async _validateIdAndGetList(id: string, isArchive = false): Promise<PM[]> {
    if (!id) {
      throw new Error(`No id was given as input`)
    }

    const list = isArchive
      ? await this._storage.getArchive()
      : await this._storage.getList()
    
    if (list.every(item => item.id !== id)) {
      throw new Error(`Unable to find item with id: ${id}`)
    }

    return list
  }

  private _validateEmpty(value: string, key: string): void {
    value = value.trim()

    if (!value) {
      throw new Error(`No ${key} was given as input`)
    }
  }

  public async create(
    account: string,
    pwd: string,
    board?: string,
    remark?: string
  ): Promise<void> {
    board = board || DEFAULT_BOARD
    remark = remark || ''

    this._validateEmpty(account, 'account')
    this._validateEmpty(pwd, 'password')

    const list = await this._storage.getList()
    const password = this._transform(pwd)
    await this._storage.save([...list, {
      id: await this._generateId(),
      account,
      password,
      board,
      remark
    }])
  }
  
  // delete时未找到id不做提示，静默处理
  public async delete(ids?: string[]): Promise<void> {
    if (!ids || !ids.length) {
      throw new Error(`[delete] No id was given as input`)
    }

    const list = await this._storage.getList()
    const archiveList = await this._storage.getArchive()
    this._storage.save(list.filter(item => !ids.includes(item.id)))

    let id = Number(this._generateArchiveId(archiveList))
    this._storage.saveArchive([
      ...archiveList,
      ...list
        .filter(item => ids.includes(item.id))
        .map(item => ({ ...item, id: String(id++) }))
    ])
  }

  public async get(id: string, mask = defaultMask): Promise<PM> {
    const list = await this._validateIdAndGetList(id)
    const item = list.find(item => item.id === id)!
    return {
      ...item,
      password: mask || this._transform(item.password, false)
    }
  }

  public async getList(ids?: string[], mask = defaultMask, reverse = true): Promise<PM[]> {
    let list: PM[]
    if (ids) {
      list = (await this._storage.getList())
        .filter(item => ids.includes(item.id))
        .map(item => ({
          ...item,
          password: mask || this._transform(item.password, false),
          isArchived: false
        }))
    } else {
      list = (await this._storage.getList())
        .map(item => ({
          ...item,
          password: mask || this._transform(item.password, false),
          isArchived: false
        }))
    }

    list = list.filter(item => item.board !== privateBoard)

    return reverse
      ? list.reverse()
      : list
  }

  public async find(keyword: string, mask = defaultMask, reverse = true): Promise<PM[]> {
    this._validateEmpty(keyword, 'keyword')
    let list: PM[]

    if (keyword.toLowerCase() === privateBoard) {
      list = (await this._storage.getList())
        .filter(item => item.board === privateBoard)
        .map(item => ({
          ...item,
          password: mask || this._transform(item.password, false)
        }))

      return reverse
        ? list.reverse()
        : list
    }

    list = (await this._storage.getList())
      .filter(item => (item.account.includes(keyword) || item.remark.includes(keyword)) && item.board !== privateBoard)
      .map(item => ({
        ...item,
        password: mask || this._transform(item.password, false) 
      }))

    return reverse
      ? list.reverse()
      : list
  }

  public async move(id: string, board?: string): Promise<void> {
    if (!board) {
      // if borad is not given, do nothing
      return
    }

    const list = await this._validateIdAndGetList(id)
    this._validateEmpty(board, 'board')
    await this._storage.save(list.map(item => {
      if (item.id === id) {
        item.board = board
      }
      return item
    }))
  }

  public async getArchive(mask = defaultMask, reverse = true): Promise<PM[]> {
    const list = (await this._storage.getArchive())
      .map(item => ({
        ...item,
        password: mask || this._transform(item.password, false),
        isArchived: true
      }))
      .filter(item => item.board !== privateBoard)

    return reverse
      ? list.reverse()
      : list
  }

  public async edit(id: string, pwd: string): Promise<void> {
    const list = await this._validateIdAndGetList(id)
    this._validateEmpty(pwd, 'password')

    const password = this._transform(pwd)
    await this._storage.save(list.map(item => {
      if (item.id === id) {
        item.password = password
      }
      return item
    }))
  }

  public async restore(ids?: string[]): Promise<void> {
    if (!ids || !ids.length) {
      throw new Error(`[restore] No id was given as input`)
    }

    const archiveList = await this._storage.getArchive()
    const list = await this._storage.getList()

    let id = Number(this._generateId(list))
    await this._storage.save([
      ...list,
      ...archiveList
        .filter(item => ids.includes(item.id))
        .map(item => ({ ...item, id: String(id++) }))
    ])
    await this._storage.saveArchive(archiveList.filter(item => !ids.includes(item.id)))
  }

  public async remark(id: string, remark: string): Promise<void> {
    const list = await this._validateIdAndGetList(id)
    this._validateEmpty(remark, 'remark')

    await this._storage.save(list.map(item => {
      if (item.id === id) {
        return {
          ...item,
          remark
        }
      }
      return { ...item }
    }))
  }

  public async clean(): Promise<void> {
    await this._storage.saveArchive([])
  }

  public async hasMainPassword(): Promise<boolean> {
    const config = await this._storage.getConfig()
    return Boolean(config.mainPassword)
  }

  public async validateMainPassword(password: string): Promise<boolean> {
    const config = await this._storage.getConfig()
    const mainPassword = this._transform(config.mainPassword, false)
    return password === mainPassword
  }

  public async clearMainPassword(): Promise<void> {
    const config = await this._storage.getConfig()

    if (config.mainPassword) {
      delete config.mainPassword
      await this._storage.setConfig(config)
    }
  }

  public async setMainPassword(password: string): Promise<void> {
    const config = await this._storage.getConfig()
    await this._storage.setConfig({
      ...config,
      mainPassword: this._transform(password, true)
    })
  }

  public async export(dest: string): Promise<void> {
    const list = await this._storage.getList()
    await this._storage.export(list, dest)
  }
}
