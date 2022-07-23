import picocolors from 'picocolors'
import figlet from 'figlet'
import signale from 'signale'
import ConsoleGrid from 'console-grid'
import { PM } from '@kennys_wang/pm-core'
import { groupBy } from './utils'
import type { RenderGridOptions } from './types'

const { error, success, warn, info } = signale
const { red, blue, yellow, green } = picocolors

class Render {
  private _info(msg: string, suffix?: string): void {
    const [prefix, message] = ['\n', msg]
    info({ prefix, message, suffix })
  }

  private _warn(msg: string, suffix?: string): void {
    const [prefix, message] = ['\n', msg]
    warn({ prefix, message, suffix })
  }

  private _success(msg: string, suffix?: string): void {
    const [prefix, message] = ['\n', msg]
    success({ prefix, message, suffix })
  }

  private _error(msg: string, suffix?: string): void {
    const [prefix, message] = ['\n', msg]
    error({ prefix, message, suffix })
  }

  public logo(): Promise<void> {
    return new Promise((resolve, reject) => {
      figlet('Password Manager', (err, data) => {
        if (err) {
          reject(false)
          return // if error do nothing
        }
        console.info(blue(data))
        resolve()
      })
    })
  }

  public invalidCustomAppDir(path: string): void {
    const message = 'Custom app directory was not found on your system:';
    this._error(message, yellow(path))
  }

  public grid(rows: PM[], options: RenderGridOptions = {}): void {
    if (!rows || !rows.length) {
      return
    }

    const grid = new ConsoleGrid()
    const grouped = groupBy(rows, 'board')

    if (options.beforeWarning) {
      this._warn(options.beforeWarning, '\n')
    } 
    
    for (const key in grouped) {
      const count = grouped[key].length
      console.info(`@${key} (${blue(count)})`)
      const data = {
        columns: [
          { id: 'id', name: 'ID', type: 'string' },
          { id: 'account', name: 'Account', type: 'string' },
          { id: 'password', name: 'Password', type: 'string' },
          { id: 'board', name: 'Board', type: 'string' },
          { id: 'remark', name: 'Remark', type: 'string' }
        ],
        rows: grouped[key]
      }
    
      grid.render(data)
      console.info('')
    }
  }

  public catchError(error: any): void {
    this._error('', red(error.message || error))
  }

  public successCreate(account: string): void {
    const message = 'Successful create account:'
    this._success(message, green(account))
  }

  public successDelete(id: string): void {
    const message = 'Successful delete account:'
    this._success(message, green(id))
  }

  public successCopy(account: string): void {
    const message = 'Successful copy password of account:'
    this._success(message, green(account))
  }

  public successRemark(id: string, remark: string): void {
    const message = `Successful update remark of account ${id}:`
    this._success(message, green(remark))
  }

  public successMove(id: string, borad: string): void {
    const message = `Successful move account ${id} to:`
    this._success(message, green(borad))
  }

  public successEdit(id: string): void {
    const message = `Successful update password:`
    this._success(message, green(id))
  }

  public successRestore(ids: string[]): void {
    const message = `Successful restore accounts:`
    this._success(message, green(ids.join(', ')))
  }

  public successClean(): void {
    const message = `Successful clean archived accounts`
    this._success(message)
  }
}

export const render = new Render()