import { PM, PMStorage } from './types'
import { DEFAULT_BOARD } from './contants'

const defaultMask = '******'

export class PasswordManager<T extends PMStorage = PMStorage> {
  constructor(
    private _storage: T,
    private _encoder?: (pwd: string) => string,
    private _decoder?: (pwd: string) => string
  ) {}

  private _transform(pwd: string, isEncode = true) {
    if (isEncode && this._encoder) {
      return this._encoder(pwd)
    } else if (!isEncode && this._decoder) {
      return this._decoder(pwd)
    }
    return pwd
  }

  private _generateId(ls?: PM[]): string {
    const list = ls ?? this._storage.getList()
    const ids = list.map(item => parseInt(item.id, 10))
    const max = ids.length > 0 ? Math.max.apply(null, ids) : 0

    return String(max + 1)
  }

  private _generateArchiveId(ls?: PM[]): string {
    const list = ls ?? this._storage.getArchive()
    const ids = list.map(item => parseInt(item.id, 10))
    const max = ids.length > 0 ? Math.max.apply(null, ids) : 0

    return String(max + 1)
  }

  private _validateIdAndGetList(id: string, isArchive = false): PM[] {
    if (!id) {
      throw new Error(`No id was given as input`)
    }

    const list = isArchive
      ? this._storage.getArchive()
      : this._storage.getList()
    
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

  public create(
    account: string,
    pwd: string,
    board?: string,
    remark?: string
  ): void {
    board = board || DEFAULT_BOARD
    remark = remark || ''

    this._validateEmpty(account, 'account')
    this._validateEmpty(pwd, 'password')

    const list = this._storage.getList()
    const password = this._transform(pwd)
    this._storage.save([...list, {
      id: this._generateId(),
      account,
      password,
      board,
      remark
    }])
  }

  public delete(ids?: string[]): void {
    if (!ids || !ids.length) {
      throw new Error(`No id was given as input`)
    }

    const list = this._storage.getList()
    const archiveList = this._storage.getArchive()
    this._storage.save(list.filter(item => !ids.includes(item.id)))

    let id = Number(this._generateArchiveId(archiveList))
    this._storage.saveArchive([
      ...archiveList,
      ...list
        .filter(item => ids.includes(item.id))
        .map(item => ({ ...item, id: String(id++) }))
    ])
  }

  public get(id: string, mask = defaultMask): PM {
    const list = this._validateIdAndGetList(id)
    const item = list.find(item => item.id === id)!
    return {
      ...item,
      password: mask || this._transform(item.password, false)
    }
  }

  public getList(ids?: string[], mask = defaultMask): PM[] {
    if (ids) {
      return this._storage.getList()
        .filter(item => ids.includes(item.id))
        .map(item => ({
          ...item,
          password: mask || this._transform(item.password, false)
        }))
    }

    return this._storage
      .getList()
      .map(item => ({
        ...item,
        password: mask || this._transform(item.password, false) 
      }))
  }

  public find(keyword: string, mask = defaultMask): PM[] {
    this._validateEmpty(keyword, 'keyword')
    const list = this._storage.getList()
    return list
      .filter(item => item.account.includes(keyword) || item.remark.includes(keyword))
      .map(item => ({
        ...item,
        password: mask || this._transform(item.password, false) 
      }))
  }

  public move(id: string, board?: string): void {
    if (!board) {
      // if borad is not given, do nothing
      return
    }

    const list = this._validateIdAndGetList(id)
    this._validateEmpty(board, 'board')
    this._storage.save(list.map(item => {
      if (item.id === id) {
        item.board = board
      }
      return item
    }))
  }

  public getArchive(mask = defaultMask): PM[] {
    return this._storage
      .getArchive()
      .map(item => ({
        ...item,
        password: mask || this._transform(item.password, false) 
      }))
  }

  public edit(id: string, pwd: string): void {
    const list = this._validateIdAndGetList(id)
    this._validateEmpty(pwd, 'password')

    const password = this._transform(pwd)
    this._storage.save(list.map(item => {
      if (item.id === id) {
        item.password = password
      }
      return item
    }))
  }

  public restore(ids?: string[]): void {
    if (!ids || !ids.length) {
      throw new Error(`No id was given as input`)
    }

    const archiveList = this._storage.getArchive()
    const list = this._storage.getList()

    let id = Number(this._generateId(list))
    this._storage.save([
      ...list,
      ...archiveList
        .filter(item => ids.includes(item.id))
        .map(item => ({ ...item, id: String(id++) }))
    ])
    this._storage.saveArchive(archiveList.filter(item => !ids.includes(item.id)))
  }

  public remark(id: string, remark: string): void {
    const list = this._validateIdAndGetList(id)
    this._validateEmpty(remark, 'remark')

    this._storage.save(list.map(item => {
      if (item.id === id) {
        return {
          ...item,
          remark
        }
      }
      return { ...item }
    }))
  }

  public clean(): void {
    this._storage.saveArchive([])
  }
 }
