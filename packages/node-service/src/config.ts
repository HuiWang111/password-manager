import os from 'os'
import { join } from 'path'
import { writeFileSync, readFileSync } from 'fs'
import { PMConfig } from './types'
import { formatStringify, isExists } from './utils'

export class Config {
  private _configFile: string

  constructor(private _defaultConfig: PMConfig) {
    this._configFile = join(os.homedir(), '.password-manager.json')
    this._createConfigFile()
  }

  private _createConfigFile() {
    if (!isExists(this._configFile)) {
      const json = formatStringify(this._defaultConfig)
      writeFileSync(this._configFile, json, 'utf8')
    }
  }

  private _formatHomeDir(dir: string) {
    if (!dir.startsWith('~')) {
      return dir
    }

    return join(os.homedir(), dir.replace(/^~/g, ''))
  }

  public get(): PMConfig {
    const content = readFileSync(this._configFile, 'utf8')
    const config: PMConfig = JSON.parse(content.toString()).default

    if (config.pmDirectory) {
      config.pmDirectory = this._formatHomeDir(config.pmDirectory)
    }

    return { ...this._defaultConfig, ...config }
  }

  public set(config: PMConfig): void {
    writeFileSync(
      this._configFile,
      formatStringify(config),
      'utf8'
    )
  }
}
