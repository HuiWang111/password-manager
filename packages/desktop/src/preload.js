const { contextBridge } = require('electron')
const { join } = require('path')
const { createPM } = require('@kennys_wang/pm-node-service')
const { readFileSync } = require('fs')

const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'))
const defaultConfig = pkg.configuration

const passwordManager = createPM(defaultConfig)

contextBridge.exposeInMainWorld('pm', {
  getList: () => passwordManager.getList(),
  createAccount: (data) => passwordManager.create(data.account, data.password, data.board, data.remark)
})
