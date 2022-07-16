import { join } from 'path'
import os from 'os'
import type { PM, PMStorage } from '@pm/core'
import { config } from './config'
import { isExists, formatStringify } from './utils'
import { writeFileSync, mkdirSync, readFileSync } from 'fs'

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

  private _initialize(): void {
    this._appPath = this._getAppPath()
    this._storagePath = join(this._appPath, storageDir)
    this._archivePath = join(this._appPath, archiveDir)
    this._storageFile = join(this._storagePath, storageFile)
    this._archiveFile = join(this._archivePath, archiveFile)

    this._ensureDirectories()
  }

  private _getAppPath(): string {
    const { pmDirectory } = config.get()
    const defaultAppPath = join(os.homedir(), defaultAppDir)

    if (!pmDirectory) {
      return defaultAppPath
    }

    if (!isExists(pmDirectory)) {
      // TODO: render.invalidCustomAppDir(pmDirectory)
      process.exit(1)
    }

    return join(pmDirectory, defaultAppDir)
  }

  private _ensureMainAppDir(): void {
    if (!isExists(this._appPath)) {
      mkdirSync(this._appPath)
    }
  }

  private _ensureStorageDir(): void {
    if (!isExists(this._storagePath)) {
      mkdirSync(this._storagePath)
    }
  }

  private _ensureArchiveDir(): void {
    if (!isExists(this._archivePath)) {
      mkdirSync(this._archivePath)
    }
  }

  private _ensureDirectories(): void {
    this._ensureMainAppDir()
    this._ensureStorageDir()
    this._ensureArchiveDir()
  }

  public save(list: PM[]): void {
    const json = formatStringify(list)
    writeFileSync(this._storageFile, json)
  }

  public getList(): PM[] {
    if (!isExists(this._storageFile)) {
      return []
    }

    const json = readFileSync(this._storageFile, 'utf-8')
    return JSON.parse(json)
  }

  public getArchive(): PM[] {
    if (!isExists(this._archiveFile)) {
      return []
    }

    const json = readFileSync(this._archiveFile, 'utf8')
    return JSON.parse(json)
  }

  public saveArchive(list: PM[]): void {
    const json = formatStringify(list)
    writeFileSync(this._archiveFile, json)
  }
}

export const storage = new Storage()
