#!/usr/bin/env node --experimental-json-modules

// src/index.ts
import meow from "meow";
import updateNotifier from "update-notifier";
import pkg3 from "../package.json" assert { type: "json" };

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

// src/cli.ts
import pkg2 from "../package.json" assert { type: "json" };

// ../core/dist/contants.js
var DEFAULT_BOARD = "My Board";

// ../core/dist/PasswordManager.js
var PasswordManager = class {
  _storage;
  _encoder;
  _decoder;
  constructor(_storage, _encoder, _decoder) {
    this._storage = _storage;
    this._encoder = _encoder;
    this._decoder = _decoder;
  }
  _transform(pwd, isEncode = true) {
    if (isEncode && this._encoder) {
      return this._encoder(pwd);
    } else if (!isEncode && this._decoder) {
      return this._decoder(pwd);
    }
    return pwd;
  }
  _generateId(ls) {
    const list = ls ?? this._storage.getList();
    const ids = list.map((item) => parseInt(item.id, 10));
    const max = ids.length > 0 ? Math.max.apply(null, ids) : 0;
    return String(max + 1);
  }
  _generateArchiveId(ls) {
    const list = ls ?? this._storage.getArchive();
    const ids = list.map((item) => parseInt(item.id, 10));
    const max = ids.length > 0 ? Math.max.apply(null, ids) : 0;
    return String(max + 1);
  }
  _validateIdAndGetList(id, isArchive = false) {
    if (!id) {
      throw new Error(`No id was given as input`);
    }
    const list = isArchive ? this._storage.getArchive() : this._storage.getList();
    if (!list.every((item) => item.id !== id)) {
      throw new Error(`Unable to find item with id: ${id}`);
    }
    return list;
  }
  _validateEmpty(value, key) {
    value = value.trim();
    if (!value) {
      throw new Error(`No ${key} was given as input`);
    }
  }
  create(account, pwd, board) {
    board = board || DEFAULT_BOARD;
    this._validateEmpty(account, "account");
    this._validateEmpty(pwd, "password");
    const list = this._storage.getList();
    const password = this._transform(pwd);
    this._storage.save([...list, {
      id: this._generateId(),
      account,
      password,
      board
    }]);
  }
  delete(ids) {
    if (!ids || !ids.length) {
      throw new Error(`No id was given as input`);
    }
    const list = this._storage.getList();
    const archiveList = this._storage.getArchive();
    this._storage.save(list.filter((item) => !ids.includes(item.id)));
    let id = Number(this._generateArchiveId(archiveList));
    this._storage.saveArchive([
      ...archiveList,
      ...list.filter((item) => ids.includes(item.id)).map((item) => ({ ...item, id: String(id++) }))
    ]);
  }
  get(id) {
    const list = this._validateIdAndGetList(id);
    const item = list.find((item2) => item2.id === id);
    return {
      ...item,
      password: this._transform(item.password, false)
    };
  }
  getList(ids) {
    if (ids) {
      return this._storage.getList().filter((item) => ids.includes(item.id));
    }
    return this._storage.getList().map((item) => ({
      ...item,
      password: this._transform(item.password, false)
    }));
  }
  find(keyword) {
    this._validateEmpty(keyword, "keyword");
    const list = this._storage.getList();
    return list.filter((item) => item.account.includes(keyword)).map((item) => ({
      ...item,
      password: this._transform(item.password, false)
    }));
  }
  move(id, board) {
    if (!board) {
      return;
    }
    const list = this._validateIdAndGetList(id);
    this._validateEmpty(board, "board");
    this._storage.save(list.map((item) => {
      if (item.id === id) {
        item.board = board;
      }
      return item;
    }));
  }
  getArchive() {
    return this._storage.getArchive().map((item) => ({
      ...item,
      password: this._transform(item.password, false)
    }));
  }
  edit(id, pwd) {
    const list = this._validateIdAndGetList(id);
    this._validateEmpty(pwd, "password");
    const password = this._transform(pwd);
    this._storage.save(list.map((item) => {
      if (item.id === id) {
        item.password = password;
      }
      return item;
    }));
  }
  restore(ids) {
    if (!ids || !ids.length) {
      throw new Error(`No id was given as input`);
    }
    const archiveList = this._storage.getArchive();
    const list = this._storage.getList();
    let id = Number(this._generateId(list));
    this._storage.save([
      ...list,
      ...archiveList.filter((item) => ids.includes(item.id)).map((item) => ({ ...item, id: String(id++) }))
    ]);
    this._storage.saveArchive(archiveList.filter((item) => !ids.includes(item.id)));
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
import { accessSync } from "fs";
function isExists(path, mode) {
  try {
    accessSync(path, mode);
    return true;
  } catch (e) {
    return false;
  }
}
function formatStringify(data) {
  return JSON.stringify(data, null, 4);
}

// src/config.ts
import { writeFileSync, readFileSync } from "fs";
var { default: defaultConfig } = pkg.configuration;
var Config = class {
  _configFile;
  constructor() {
    this._configFile = join(os.homedir(), ".project-manager.json");
    this._createConfigFile();
  }
  _createConfigFile() {
    try {
      const json = formatStringify(defaultConfig);
      writeFileSync(this._configFile, json, "utf8");
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
  get() {
    try {
      const content = readFileSync(this._configFile);
      const config2 = JSON.parse(content.toString());
      if (config2.pmDirectory) {
        config2.pmDirectory = this._formatHomeDir(config2.pmDirectory);
      }
      return { ...defaultConfig, ...config2 };
    } catch (e) {
      throw e;
    }
  }
};
var config = new Config();

// src/storage.ts
import { writeFileSync as writeFileSync2, mkdirSync, readFileSync as readFileSync2 } from "fs";
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
  _initialize() {
    this._appPath = this._getAppPath();
    this._storagePath = join2(this._appPath, storageDir);
    this._archivePath = join2(this._appPath, archiveDir);
    this._storageFile = join2(this._storagePath, storageFile);
    this._archiveFile = join2(this._archivePath, archiveFile);
    this._ensureDirectories();
  }
  _getAppPath() {
    const { pmDirectory } = config.get();
    const defaultAppPath = join2(os2.homedir(), defaultAppDir);
    if (!pmDirectory) {
      return defaultAppPath;
    }
    if (!isExists(pmDirectory)) {
      process.exit(1);
    }
    return join2(pmDirectory, defaultAppDir);
  }
  _ensureMainAppDir() {
    if (!isExists(this._appPath)) {
      mkdirSync(this._appPath);
    }
  }
  _ensureStorageDir() {
    if (!isExists(this._storagePath)) {
      mkdirSync(this._storagePath);
    }
  }
  _ensureArchiveDir() {
    if (!isExists(this._archivePath)) {
      mkdirSync(this._archivePath);
    }
  }
  _ensureDirectories() {
    this._ensureMainAppDir();
    this._ensureStorageDir();
    this._ensureArchiveDir();
  }
  save(list) {
    const json = formatStringify(list);
    writeFileSync2(this._storageFile, json);
  }
  getList() {
    if (!isExists(this._storageFile)) {
      return [];
    }
    const json = readFileSync2(this._storageFile, "utf-8");
    return JSON.parse(json);
  }
  getArchive() {
    if (!isExists(this._archiveFile)) {
      return [];
    }
    const json = readFileSync2(this._archiveFile, "utf8");
    return JSON.parse(json);
  }
  saveArchive(list) {
    const json = formatStringify(list);
    writeFileSync2(this._archiveFile, json);
  }
};
var storage = new Storage();

// src/pm.ts
import CryptoJS from "crypto-js";
var { AES, enc } = CryptoJS;
var SECRET_KEY = "the secret key for password manager";
function pwdEncoder(pwd) {
  return AES.encrypt(pwd, SECRET_KEY).toString();
}
function pwdDecoder(pwd) {
  return AES.decrypt(pwd, SECRET_KEY).toString(enc.Utf8);
}
var PM = class extends PasswordManager {
  constructor(storage2, encoder, decoder) {
    super(storage2, encoder, decoder);
  }
};
var passwordManager = new PM(storage, pwdEncoder, pwdDecoder);

// src/cli.ts
function PMCli(input, flags) {
  if (flags.archive) {
    return passwordManager.getArchive();
  }
  if (flags.create) {
    const board = input.find((i) => i.startsWith("@"))?.slice(1);
    const rest = input.filter((i) => !i.startsWith("@"));
    return passwordManager.create(rest[0], rest[1], board);
  }
  if (flags.delete) {
    return passwordManager.delete(input);
  }
  if (flags.copy) {
    return;
  }
  if (flags.show) {
    return passwordManager.getList(input);
  }
  if (flags.help) {
    return console.info(help);
  }
  if (flags.find) {
    return passwordManager.find(input[0]);
  }
  if (flags.move) {
    const board = input.find((i) => i.startsWith("@"))?.slice(1);
    const rest = input.filter((i) => !i.startsWith("@"));
    return passwordManager.move(rest[0], board);
  }
  if (flags.archive) {
    return passwordManager.getArchive();
  }
  if (flags.edit) {
    return passwordManager.edit(input[0], input[1]);
  }
  if (flags.restore) {
    return passwordManager.restore(input);
  }
  if (flags.version) {
    return console.info(pkg2.version);
  }
  return passwordManager.getList();
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
updateNotifier({ pkg: pkg3 }).notify();
(function() {
  const res = PMCli(result.input, result.flags);
  console.log(res);
})();
