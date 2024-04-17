import { createPM } from '@kennys_wang/pm-node-service'
import { Injectable } from '@nestjs/common'
import type { PM } from '@kennys_wang/pm-node-service'
import type { PM as PMType } from '@kennys_wang/pm-core/dist/cjs/types'
import type { IAccountData } from './types'

@Injectable()
export class AppService {
  private pm: PM

  constructor() {
    this.pm = createPM({
      default: {
        pmDirectory: '~'
      }
    })
  }

  getList(ids?: string[], mask?: string, reverse?: boolean): Promise<PMType[]> {
    return this.pm.getList(ids, mask, reverse)
  }

  getOriginalList() {
    return this.pm.getOriginalList()
  }

  async createAccount(data: IAccountData) {
    await this.pm.create(data.account, data.password, data.board, data.remark)
    return 'ok'
  }

  async deleteAccount(id: string) {
    await this.pm.delete([id])
    return 'ok'
  }

  async editAccount(id: string, remark?: string, password?: string, board?: string) {
    if (remark) {
      await this.pm.remark(id, remark)
    }
    if (password) {
      await this.pm.edit(id, password)
    }
    if (board) {
      await this.pm.move(id, board)
    }
    return 'ok'
  }

  getArchivedAccounts(mask?: string) {
    return this.pm.getArchive(mask)
  }

  async clearArchivedAccounts() {
    await this.pm.clean()
    return 'ok'
  }

  async restoreAccounts(ids?: string[]) {
    await this.pm.restore(ids)
    return 'ok'
  }
}
