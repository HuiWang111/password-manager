import os from 'node:os'
import { join } from 'node:path'
import { writeFile, readFile } from 'node:fs/promises'
import { PMConfig } from './types'
import { formatStringify, isExists } from './utils'

export class Config {
  private _configFile: string

  constructor(private _defaultConfig: { default: PMConfig }) {
    this._configFile = join(os.homedir(), '.password-manager.json')
  }

  private async _createConfigFile() {
    if (!await isExists(this._configFile)) {
      const json = formatStringify(this._defaultConfig)
      await writeFile(this._configFile, json, 'utf8')
    }
  }

  private _formatHomeDir(dir: string) {
    if (!dir.startsWith('~')) {
      return dir
    }

    return join(os.homedir(), dir.replace(/^~/g, ''))
  }

  public async get(): Promise<PMConfig> {
    await this._createConfigFile()
    const content = await readFile(this._configFile, 'utf8')
    const config: PMConfig = JSON.parse(content.toString()).default

    if (config.pmDirectory) {
      config.pmDirectory = this._formatHomeDir(config.pmDirectory)
    }

    return { ...this._defaultConfig.default, ...config }
  }

  public async set(config: PMConfig): Promise<void> {
    await this._createConfigFile()
    const data = {
      default: config
    }

    await writeFile(
      this._configFile,
      formatStringify(data),
      'utf8'
    )
  }
}
