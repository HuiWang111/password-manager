#!/usr/bin/env node --experimental-specifier-resolution=node

import meow from 'meow'
import updateNotifier from 'update-notifier';
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import { help } from './help'
import { PMFlags } from './types'
import { PMCli } from './cli'
import { render } from './render'

(async function () {
  try {
    const result = meow<PMFlags>(help, {
      importMeta: import.meta,
      flags: {
        create: {
          type: 'boolean',
          alias: 'c'
        },
        delete: {
          type: 'boolean',
          alias: 'd'
        },
        copy: {
          type: 'boolean',
          alias: 'y'
        },
        remark: {
          type: 'boolean',
          alias: 'k'
        },
        show: {
          type: 'boolean',
          alias: 's'
        },
        help: {
          type: 'boolean',
          alias: 'h'
        },
        find: {
          type: 'boolean',
          alias: 'f'
        },
        move: {
          type: 'boolean',
          alias: 'm'
        },
        archive: {
          type: 'boolean',
          alias: 'a'
        },
        edit: {
          type: 'boolean',
          alias: 'e'
        },
        restore: {
          type: 'boolean',
          alias: 'r'
        },
        version: {
          type: 'boolean',
          alias: 'v'
        },
        clean: {
          type: 'boolean',
          alias: 'n'
        }
      }
    })
    
    const __dirname = dirname(fileURLToPath(import.meta.url))
    const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'))
    
    updateNotifier({ pkg }).notify();
  
    await PMCli(
      result.input,
      result.flags,
      pkg.version,
      pkg.configuration)
  } catch (e) {
    if (e !== false) {
      render.catchError(e)
    }
  }
})()

