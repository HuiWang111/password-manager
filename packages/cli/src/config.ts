import os from 'os'
import { join } from 'path'
import pkg from '../package.json' assert { type: 'json' }
import { PMConfig } from './types'
import { writeFile, readFile, formatStringify } from './utils'

const { default: defaultConfig } = pkg.configuration

class Config {
  private _configFile: string

  constructor() {
    this._configFile = join(os.homedir(), '.project-manager.json')
    this._createConfigFile()
  }

  private async _createConfigFile() {
    try {
      const json = formatStringify(defaultConfig)
      await writeFile(this._configFile, json, 'utf8')
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

  public async get(): Promise<PMConfig> {
    try {
      const content = await readFile(this._configFile)
      const config: PMConfig = JSON.parse(content.toString())

      if (config.pmDirectory) {
        config.pmDirectory = this._formatHomeDir(config.pmDirectory)
      }

      return { ...defaultConfig, ...config }
    } catch (e) {
      return Promise.reject(e)
    }
  }
}

export const config = new Config()
