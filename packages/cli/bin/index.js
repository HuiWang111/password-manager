#!/usr/bin/env node --experimental-json-modules

// src/index.ts
import meow from "meow";
import updateNotifier from "update-notifier";
import pkg2 from "../package.json" assert { type: "json" };

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

// ../core/dist/contants.js
var DEFAULT_BOARD = "My Board";

// ../core/dist/PasswordManager.js
var PasswordManager = class {
  _storage;
  constructor(_storage) {
    this._storage = _storage;
  }
  async _generateId(ls) {
    const list = ls ?? await this._storage.getList();
    const ids = list.map((item) => parseInt(item.id, 10));
    const max = ids.length > 0 ? Math.max.apply(null, ids) : 0;
    return String(max + 1);
  }
  async _generateArchiveId(ls) {
    const list = ls ?? await this._storage.getArchive();
    const ids = list.map((item) => parseInt(item.id, 10));
    const max = ids.length > 0 ? Math.max.apply(null, ids) : 0;
    return String(max + 1);
  }
  async _validateIdAndGetList(id, isArchive = false) {
    try {
      if (!id) {
        return Promise.reject(new Error(`No id was given as input`));
      }
      const list = isArchive ? await this._storage.getArchive() : await this._storage.getList();
      if (!list.every((item) => item.id !== id)) {
        return Promise.reject(new Error(`Unable to find item with id: ${id}`));
      }
      return Promise.resolve(list);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  async _validateEmpty(value, key) {
    return new Promise((resolve, reject) => {
      value = value.trim();
      if (!value) {
        reject(new Error(`No ${key} was given as input`));
      } else {
        resolve();
      }
    });
  }
  async create(account, password, board) {
    try {
      board = board || DEFAULT_BOARD;
      await this._validateEmpty(account, "account");
      await this._validateEmpty(password, "password");
      const list = await this._storage.getList();
      await this._storage.save([...list, {
        id: await this._generateId(),
        account,
        password,
        board
      }]);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  async delete(id) {
    try {
      const list = await this._validateIdAndGetList(id);
      const archiveList = await this._storage.getArchive();
      await this._storage.save(list.filter((item) => item.id !== id));
      await this._storage.saveArchive([...archiveList, {
        ...list.find((item) => item.id === id),
        id: await this._generateArchiveId(archiveList)
      }]);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  async get(id) {
    try {
      const list = await this._validateIdAndGetList(id);
      return list.find((item) => item.id === id);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  async getList() {
    try {
      return await this._storage.getList();
    } catch (e) {
      return Promise.reject(e);
    }
  }
  async find(keyword) {
    try {
      await this._validateEmpty(keyword, "keyword");
      const list = await this._storage.getList();
      return list.filter((item) => item.account.includes(keyword));
    } catch (e) {
      return Promise.reject(e);
    }
  }
  async move(id, board) {
    try {
      const list = await this._validateIdAndGetList(id);
      await this._validateEmpty(board, "board");
      await this._storage.save(list.map((item) => {
        if (item.id === id) {
          item.board = board;
        }
        return item;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  }
  async getArchive() {
    try {
      return await this._storage.getArchive();
    } catch (e) {
      return Promise.reject(e);
    }
  }
  async edit(id, password) {
    try {
      const list = await this._validateIdAndGetList(id);
      await this._validateEmpty(password, "password");
      await this._storage.save(list.map((item) => {
        if (item.id === id) {
          item.password = password;
        }
        return item;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  }
  async restore(id) {
    try {
      const archiveList = await this._validateIdAndGetList(id, true);
      const list = await this._storage.getList();
      await this._storage.save([...list, {
        ...archiveList.find((item) => item.id === id),
        id: await this._generateId(list)
      }]);
      await this._storage.saveArchive(archiveList.filter((item) => item.id !== id));
    } catch (e) {
      return Promise.reject(e);
    }
  }
};

// src/storage.ts
import { join as join2 } from "path";
import os2 from "os";

// src/config.ts
import os from "os";
import { join } from "path";
import pkg from "../package.json" assert { type: "json" };

// src/utils.ts
import { writeFileSync, readFileSync, accessSync, mkdirSync } from "fs";
async function isExists(path, mode) {
  return new Promise((resolve, reject) => {
    try {
      accessSync(path, mode);
      resolve(true);
    } catch (e) {
      resolve(false);
    }
  });
}
function promisifyForSync(fn) {
  return function promised(...args) {
    return new Promise((resolve, reject) => {
      try {
        const data = fn(...args);
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  };
}
var writeFile = promisifyForSync(writeFileSync);
var readFile = promisifyForSync(readFileSync);
var mkdir = promisifyForSync(mkdirSync);
function formatStringify(data) {
  return JSON.stringify(data, null, 4);
}

// src/config.ts
var { default: defaultConfig } = pkg.configuration;
var Config = class {
  _configFile;
  constructor() {
    this._configFile = join(os.homedir(), ".project-manager.json");
    this._createConfigFile();
  }
  async _createConfigFile() {
    try {
      const json = formatStringify(defaultConfig);
      await writeFile(this._configFile, json, "utf8");
    } catch (e) {
      console.error(e);
    }
  }
  _formatHomeDir(dir) {
    if (!dir.startsWith("~")) {
      return dir;
    }
    return join(os.homedir(), dir.replace(/^~/g, ""));
  }
  async get() {
    try {
      const content = await readFile(this._configFile);
      const config2 = JSON.parse(content.toString());
      if (config2.pmDirectory) {
        config2.pmDirectory = this._formatHomeDir(config2.pmDirectory);
      }
      return { ...defaultConfig, ...config2 };
    } catch (e) {
      return Promise.reject(e);
    }
  }
};
var config = new Config();

// src/storage.ts
var defaultAppDir = ".project-manager";
var storageDir = "storage";
var archiveDir = "archive";
var storageFile = "storage.json";
var archiveFile = "archive.json";
var Storage = class {
  _appPath;
  _storagePath;
  _archivePath;
  _storageFile;
  _archiveFile;
  constructor() {
    this.save = this.save.bind(this);
    this.saveArchive = this.saveArchive.bind(this);
    this.getList = this.getList.bind(this);
    this.getArchive = this.getArchive.bind(this);
    this._initialize();
  }
  async _initialize() {
    try {
      this._appPath = await this._getAppPath();
      this._storagePath = join2(this._appPath, storageDir);
      this._archivePath = join2(this._appPath, archiveDir);
      this._storageFile = join2(this._storagePath, storageFile);
      this._archiveFile = join2(this._archivePath, archiveFile);
      await this._ensureDirectories();
    } catch (e) {
      console.error(e);
    }
  }
  async _getAppPath() {
    try {
      const { pmDirectory } = await config.get();
      const defaultAppPath = join2(os2.homedir(), defaultAppDir);
      if (!pmDirectory) {
        return defaultAppPath;
      }
      if (!await isExists(pmDirectory)) {
        process.exit(1);
      }
      return join2(pmDirectory, defaultAppDir);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  async _ensureMainAppDir() {
    if (!await isExists(this._appPath)) {
      await mkdir(this._appPath);
    }
  }
  async _ensureStorageDir() {
    if (!await isExists(this._storagePath)) {
      await mkdir(this._storagePath);
    }
  }
  async _ensureArchiveDir() {
    if (!await isExists(this._archivePath)) {
      await mkdir(this._archivePath);
    }
  }
  async _ensureDirectories() {
    await this._ensureMainAppDir();
    await this._ensureStorageDir();
    await this._ensureArchiveDir();
  }
  async save(list) {
    try {
      const json = formatStringify(list);
      await writeFile(this._storageFile, json);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  async getList() {
    try {
      if (!await isExists(this._storageFile)) {
        return [];
      }
      const json = await readFile(this._storageFile, "utf-8");
      return JSON.parse(json);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  async getArchive() {
    try {
      if (!await isExists(this._archiveFile)) {
        return [];
      }
      const json = await readFile(this._archiveFile, "utf8");
      return JSON.parse(json);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  async saveArchive(list) {
    try {
      const json = formatStringify(list);
      await writeFile(this._archiveFile, json);
    } catch (e) {
      return Promise.reject(e);
    }
  }
};
var storage = new Storage();

// src/pm.ts
var PM = class extends PasswordManager {
  constructor(_storage) {
    super(_storage);
  }
};
var passwordManager = new PM(storage);

// src/cli.ts
async function PMCli(input, flags) {
  if (flags.archive) {
    return await passwordManager.getArchive();
  }
  if (flags.create) {
    const board = input.find((i) => i.startsWith("@"))?.slice(1);
    const rest = input.filter((i) => !i.startsWith("@"));
    return await passwordManager.create(rest[0], rest[1], board);
  }
  return await passwordManager.getList();
}

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
updateNotifier({ pkg: pkg2 }).notify();
(async function() {
  const res = await PMCli(result.input, result.flags);
  console.log(res);
})();
