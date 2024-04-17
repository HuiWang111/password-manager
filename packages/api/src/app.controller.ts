import { Controller, Delete, Put, Body, Patch, Post, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import type { IAccountData, IEditAccountParams, IGetListParams } from './types';
import { toBoolean } from './utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/accounts')
  getList(@Query() data: IGetListParams) {
    if (toBoolean(data.original)) {
      return this.appService.getOriginalList()
    }
    return this.appService.getList(data.ids, data.mask, toBoolean(data.reverse))
  }

  @Put('/account')
  createAccount(@Body() data: IAccountData) {
    return this.appService.createAccount(data)
  }

  @Delete('/account')
  deleteAccount(@Body() data: { id: string }) {
    return this.appService.deleteAccount(data.id)
  }

  @Patch('/account')
  editAccount(@Body() data: IEditAccountParams) {
    return this.appService.editAccount(data.id, data.remark, data.password, data.board)
  }

  @Get('/archived/accounts')
  getArchivedAccounts(@Body() data: { mask?: string }) {
    return this.appService.getArchivedAccounts(data.mask)
  }

  @Post('/archived/clear')
  clearArchivedAccounts() {
    return this.appService.clearArchivedAccounts()
  }

  @Post('/archived/restore')
  restoreAccounts(@Body() data: { ids: string[] }) {
    return this.appService.restoreAccounts(data.ids)
  }
}
