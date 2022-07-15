import { join } from 'path'
import os from 'os'
import type { PM, PMStorage } from '@pm/core'
import { config } from './config'
import { isExists, writeFile, mkdir, readFile, formatStringify } from './utils'

const defaultAppDir = '.project-manager'
const storageDir = 'storage'
const archiveDir = 'archive'
const storageFile = 'storage.json'
const archiveFile = 'archive.json'

class Storage implements PMStorage {
  private _appPath: string
  private _storagePath: string
  private _archivePath: string
  private _storageFile: string
  private _archiveFile: string

  constructor() {
    this.save = this.save.bind(this)
    this.saveArchive = this.saveArchive.bind(this)
    this.getList = this.getList.bind(this)
    this.getArchive = this.getArchive.bind(this)

    this._initialize()
  }

  private async _initialize(): Promise<void> {
    try {
      this._appPath = await this._getAppPath()
      this._storagePath = join(this._appPath, storageDir)
      this._archivePath = join(this._appPath, archiveDir)
      this._storageFile = join(this._storagePath, storageFile)
      this._archiveFile = join(this._archivePath, archiveFile)

      await this._ensureDirectories()
    } catch (e) {
      // TODO: render
      console.error(e)
    }
  }

  private async _getAppPath(): Promise<string> {
    try {
      const { pmDirectory } = await config.get()
      const defaultAppPath = join(os.homedir(), defaultAppDir)

      if (!pmDirectory) {
        return defaultAppPath
      }

      if (!await isExists(pmDirectory)) {
        // TODO: render.invalidCustomAppDir(pmDirectory)
        process.exit(1)
      }

      return join(pmDirectory, defaultAppDir)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  private async _ensureMainAppDir(): Promise<void> {
    if (!await isExists(this._appPath)) {
      await mkdir(this._appPath)
    }
  }

  private async _ensureStorageDir(): Promise<void> {
    if (!await isExists(this._storagePath)) {
      await mkdir(this._storagePath)
    }
  }

  private async _ensureArchiveDir(): Promise<void> {
    if (!await isExists(this._archivePath)) {
      await mkdir(this._archivePath)
    }
  }

  private async _ensureDirectories(): Promise<void> {
    await this._ensureMainAppDir()
    await this._ensureStorageDir()
    await this._ensureArchiveDir()
  }

  public async save(list: PM[]): Promise<void> {
    try {
      const json = formatStringify(list)
      await writeFile(this._storageFile, json)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  public async getList(): Promise<PM[]> {
    try {
      if (!await isExists(this._storageFile)) {
        return []
      }

      const json = await readFile(this._storageFile, 'utf-8')
      return JSON.parse(json)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  public async getArchive(): Promise<PM[]> {
    try {
      if (!await isExists(this._archiveFile)) {
        return []
      }

      const json = await readFile(this._archiveFile, 'utf8')
      return JSON.parse(json)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  public async saveArchive(list: PM[]): Promise<void> {
    try {
      const json = formatStringify(list)
      await writeFile(this._archiveFile, json)
    } catch (e) {
      return Promise.reject(e)
    }
  }
}

export const storage = new Storage()
