#!/usr/bin/env node --experimental-json-modules

import meow from 'meow'
import updateNotifier from 'update-notifier';
import pkg from '../package.json' assert { type: 'json' };
import { help } from './help'
import { PMFlags } from './types'
import { PMCli } from './cli'

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
    }
  }
})

updateNotifier({ pkg }).notify();

(function () {
  const res = PMCli(result.input, result.flags)
  console.log(res)
})()

