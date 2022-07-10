import { PM, PMStorage } from './types'
import { DEFAULT_BOARD } from './contants'

export class PasswordManager<T extends PMStorage = PMStorage> {
  constructor(
    private _storage: T
  ) {}

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
    try {
      if (!id) {
        return Promise.reject(new Error(`No id was given as input`))
      }

      const list = isArchive
        ? await this._storage.getArchive()
        : await this._storage.getList()

      if (!list.every(item => item.id !== id)) {
        return Promise.reject(new Error(`Unable to find item with id: ${id}`))
      }

      return Promise.resolve(list)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  private async _validateEmpty(value: string, key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      value = value.trim()

      if (!value) {
        reject(new Error(`No ${key} was given as input`))
      } else {
        resolve()
      }
    })
  }

  public async create(
    account: string,
    password: string,
    board?: string
  ): Promise<void> {
    try {
      board = board || DEFAULT_BOARD

      await this._validateEmpty(account, 'account')
      await this._validateEmpty(password, 'password')
      const list = await this._storage.getList()
      await this._storage.save([...list, {
        id: await this._generateId(),
        account,
        password,
        board
      }])
    } catch (e) {
      return Promise.reject(e)
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      const list = await this._validateIdAndGetList(id)
      const archiveList = await this._storage.getArchive()
      await this._storage.save(list.filter(item => item.id !== id))
      await this._storage.saveArchive([...archiveList, {
        ...list.find(item => item.id === id)!,
        id: await this._generateArchiveId(archiveList)
      }])
    } catch(e) {
      return Promise.reject(e)
    }
  }

  public async get(id: string): Promise<PM> {
    try {
      const list = await this._validateIdAndGetList(id)
      return list.find(item => item.id === id)!
    } catch (e) {
      return Promise.reject(e)
    }
  }

  public async getList(): Promise<PM[]> {
    try {
      return await this._storage.getList()
    } catch (e) {
      return Promise.reject(e)
    }
  }

  public async find(keyword: string): Promise<PM[]> {
    try {
      await this._validateEmpty(keyword, 'keyword')
      const list = await this._storage.getList()
      return list.filter(item => item.account.includes(keyword))
    } catch (e) {
      return Promise.reject(e)
    }
  }

  public async move(id: string, board: string): Promise<void> {
    try {
      const list = await this._validateIdAndGetList(id)
      await this._validateEmpty(board, 'board')
      await this._storage.save(list.map(item => {
        if (item.id === id) {
          item.board = board
        }
        return item
      }))
    } catch(e) {
      return Promise.reject(e)
    }
  }

  public async getArchive(): Promise<PM[]> {
    try {
      return await this._storage.getArchive()
    } catch (e) {
      return Promise.reject(e)
    }
  }

  public async edit(id: string, password: string): Promise<void> {
    try {
      const list = await this._validateIdAndGetList(id)
      await this._validateEmpty(password, 'password')
      await this._storage.save(list.map(item => {
        if (item.id === id) {
          item.password = password
        }
        return item
      }))
    } catch (e) {
      return Promise.reject(e)
    }
  }

  public async restore(id: string) {
    try {
      const archiveList = await this._validateIdAndGetList(id, true)
      const list = await this._storage.getList()
      await this._storage.save([...list, {
        ...archiveList.find(item => item.id === id)!,
        id: await this._generateId(list)
      }])
      await this._storage.saveArchive(archiveList.filter(item => item.id !== id))
    } catch (e) {
      return Promise.reject(e)
    }
  }
}
