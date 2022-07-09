#!/usr/bin/env node --experimental-json-modules

// src/index.ts
import meow from "meow";
import updateNotifier from "update-notifier";
import pkg from "../package.json" assert { type: "json" };

// src/help.ts
var help = `
  Usage
    $ pm [<options> ...]

  Options
      none             Display account list
    --create, -c       Create account
    --delete, -d       Delete account
    --copy, -y         Copy account password
    --show, -s         Display account password
    --help, -h         Display help message
    --find, -f         Search for accounts
    --move, -m         Move account between boards
    --archive, -a      Display archived accounts
    --edit, -e         Edit account password
    --restore, -r      Restore accounts from archive
    --version, -v      Display installed version

  Example
    $ pm
    $ pm --create @mine 11@qq.com 123456
    $ pm --delete 1
    $ pm --copy 1
    $ pm --show 1
    $ pm --help
    $ pm --find qq.com
    $ pm --move @1 xiaoming
    $ pm --archive
    $ pm --edit @1 67890
    $ pm --restore 4
    $ pm --version
`;

// src/index.ts
var result = meow(help, {
  importMeta: import.meta,
  flags: {
    create: {
      type: "boolean",
      alias: "c"
    },
    delete: {
      type: "boolean",
      alias: "d"
    },
    copy: {
      type: "boolean",
      alias: "y"
    },
    show: {
      type: "boolean",
      alias: "s"
    },
    help: {
      type: "boolean",
      alias: "h"
    },
    find: {
      type: "boolean",
      alias: "f"
    },
    move: {
      type: "boolean",
      alias: "m"
    },
    archive: {
      type: "boolean",
      alias: "a"
    },
    edit: {
      type: "boolean",
      alias: "e"
    },
    restore: {
      type: "boolean",
      alias: "r"
    },
    version: {
      type: "boolean",
      alias: "v"
    }
  }
});
updateNotifier({ pkg }).notify();
console.log(result);
