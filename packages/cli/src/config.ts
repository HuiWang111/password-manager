import os from 'os'
import { join } from 'path'
import { PMConfig } from './types'
import { formatStringify } from './utils'
import { writeFileSync, readFileSync } from 'fs'

export class Config {
  private _configFile: string

  constructor(private _defaultConfig: PMConfig) {
    this._configFile = join(os.homedir(), '.password-manager.json')
    this._createConfigFile()
  }

  private _createConfigFile() {
    try {
      type t = typeof this._defaultConfig
      const json = formatStringify(this._defaultConfig)
      writeFileSync(this._configFile, json, 'utf8')
    } catch (e) {
      // TODO: render
      console.error(e)
    }
  }

  private _formatHomeDir(dir: string) {
    if (!dir.startsWith('~')) {
      return dir
    }

    return join(os.homedir(), dir.replace(/^~/g, ''))
  }

  public get(): PMConfig {
    try {
      const content = readFileSync(this._configFile)
      const config: PMConfig = JSON.parse(content.toString())

      if (config.pmDirectory) {
        config.pmDirectory = this._formatHomeDir(config.pmDirectory)
      }

      return { ...this._defaultConfig, ...config }
    } catch (e) {
      throw e
    }
  }
}
