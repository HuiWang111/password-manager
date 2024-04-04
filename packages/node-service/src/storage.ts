import { join } from 'node:path'
import os from 'node:os'
import { writeFile, mkdir, readFile } from 'node:fs/promises'
import { Config } from './config'
import { isExists, formatStringify } from './utils'
import type { PM, PMStorage } from '@kennys_wang/pm-core'
import type { PMConfig } from './types'

const defaultAppDir = '.password-manager'
const storageDir = 'storage'
const archiveDir = 'archive'
const storageFile = 'storage.json'
const archiveFile = 'archive.json'

export class Storage implements PMStorage {
  private _appPath: string
  private _storagePath: string
  private _archivePath: string
  private _storageFile: string
  private _archiveFile: string
  private _config: Config

  constructor(
      defaultConfig: { default: PMConfig },
      private _invalidCustomAppDirCallback?: (path: string) => void) {
    this._config = new Config(defaultConfig)

    this.save = this.save.bind(this)
    this.saveArchive = this.saveArchive.bind(this)
    this.getList = this.getList.bind(this)
    this.getArchive = this.getArchive.bind(this)

    this._initialize()
  }

  private async _initialize(): Promise<void> {
    this._appPath = await this._getAppPath()
    this._storagePath = join(this._appPath, storageDir)
    this._archivePath = join(this._appPath, archiveDir)
    this._storageFile = join(this._storagePath, storageFile)
    this._archiveFile = join(this._archivePath, archiveFile)

    this._ensureDirectories()
  }

  private async _getAppPath(): Promise<string> {
    const { pmDirectory } = await this._config.get()
    const defaultAppPath = join(os.homedir(), defaultAppDir)

    if (!pmDirectory) {
      return defaultAppPath
    }
    
    if (!isExists(pmDirectory)) {
      this._invalidCustomAppDirCallback?.(pmDirectory)
      return ''
    }

    return join(pmDirectory, defaultAppDir)
  }

  private async _ensureMainAppDir(): Promise<void> {
    if (!isExists(this._appPath)) {
      await mkdir(this._appPath)
    }
  }

  private async _ensureStorageDir(): Promise<void> {
    if (!isExists(this._storagePath)) {
      await mkdir(this._storagePath)
    }
  }

  private async _ensureArchiveDir(): Promise<void> {
    if (!isExists(this._archivePath)) {
      await mkdir(this._archivePath)
    }
  }

  private async _ensureDirectories(): Promise<void> {
    await this._ensureMainAppDir()
    await this._ensureStorageDir()
    await this._ensureArchiveDir()
  }

  public async save(list: PM[]): Promise<void> {
    const json = formatStringify(list)
    await writeFile(this._storageFile, json)
  }

  public async getList(): Promise<PM[]> {
    if (!isExists(this._storageFile)) {
      return []
    }

    const json = await readFile(this._storageFile, 'utf-8')
    return JSON.parse(json)
  }

  public async getArchive(): Promise<PM[]> {
    if (!isExists(this._archiveFile)) {
      return []
    }

    const json = await readFile(this._archiveFile, 'utf8')
    return JSON.parse(json)
  }

  public async saveArchive(list: PM[]): Promise<void> {
    const json = formatStringify(list)
    await writeFile(this._archiveFile, json)
  }

  public getConfig(): Promise<PMConfig> {
    return this._config.get()
  }

  public async setConfig(config: PMConfig): Promise<void> {
    await this._config.set(config)
  }

  public async export(content: PM[], dest: string): Promise<void> {
    await writeFile(
      dest,
      formatStringify(content),
    )
  }
}
