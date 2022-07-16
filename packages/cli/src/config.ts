import os from 'os'
import { join } from 'path'
import pkg from '../package.json' assert { type: 'json' }
import { PMConfig } from './types'
import { formatStringify } from './utils'
import { writeFileSync, readFileSync } from 'fs'

const { default: defaultConfig } = pkg.configuration

class Config {
  private _configFile: string

  constructor() {
    this._configFile = join(os.homedir(), '.project-manager.json')
    this._createConfigFile()
  }

  private _createConfigFile() {
    try {
      const json = formatStringify(defaultConfig)
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

      return { ...defaultConfig, ...config }
    } catch (e) {
      throw e
    }
  }
}

export const config = new Config()
