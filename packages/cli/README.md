# @kennys_wang/pm-cli
密码管理命令行工具

## Install
```bash
yarn global add @kennys_wang/pm-cli
```
```bash
npm install @kennys_wang/pm-cli -g
```

## Usage
```bash
$ pm [<options> ...]
```

## Options

### 1. none options
展示所有账号列表，会根据面板名称分表格展示。此时显示的密码是星号，如果需要查看真实密码，请使用`--show`命令。
```bash
$ pm
@New Board (1)
┌────┬───────────┬──────────┬───────────┬─────────────┐
│ ID │ Account   │ Password │ Board     │ Remark      │
├────┼───────────┼──────────┼───────────┼─────────────┤
│ 1  │ 11@qq.com │ ******   │ New Board │ test remark │
└────┴───────────┴──────────┴───────────┴─────────────┘

@My Board (2)
┌────┬───────────┬──────────┬──────────┬────────┐
│ ID │ Account   │ Password │ Board    │ Remark │
├────┼───────────┼──────────┼──────────┼────────┤
│ 2  │ 22@qq.com │ ******   │ My Board │        │
│ 3  │ 33@qq.com │ ******   │ My Board │        │
└────┴───────────┴──────────┴──────────┴────────┘
```

### 2. `--create` or `-c`
创建一个新的账号密码并加密存储；可以使用`@borad-name`区分账号放置的面板。如不设置面板则放置到默认的`My Board`下。
```bash
$ pm --create 11@qq.com 123456 # 放置到默认面板中
$ pm --create @custom-borad 11@qq.com 123456 # 放置到自定义面板中
```

### 3. `--delete` or `-d`
根据给定id删除账号信息。
```bash
$ pm --delete 1
```

### 4. `--copy` or `-y`
根据给定id复制密码到粘贴板，**注**：复制到粘贴板的密码是已经被解密的密码。
```bash
$ pm --copy 1
```

### 5. `--show` or `-s`
根据给定id在命令行显示密码，**注**：复制到粘贴板的密码是已经被解密的密码。
```bash
$ pm --show 1
```

### 6. `--remark` or `-k`
根据给定id为账号设置备注。
```bash
$ pm --remark 1 this is my qq account
```

### 7. `--help` or `-h`
显示帮助信息。
```bash
$ pm --help
```

### 8. `--find` or `-f`
根据账号信息或者备注信息的关键字搜索账号。此时展示的密码是星号，如果需要查看真实密码，请使用`--show`
```bash
$ pm --find qq.com
```

### 9. `--move` or `-m`
将给定id的账号移动到目标面板中。
```bash
$ pm --move @1 xiaoming # 将id为1的账号移动到xiaoming面板中，这里的面板是否已经存在都无所谓
```

### 10. `archive` or `-a`
展示已经被删除的所有账号
```bash
$ pm --archive
```

### 11. `--edit` or `-e`
根据给定id修改密码。
```bash
$ pm --edit @1 654321
```

### 12. `--restore` or `-r`
根据给定id恢复已经被删除的账号。可以是多个id
```bash
$ pm --restore 4 5
```

### 13. `--version` or `-v`
展示当前`@kennys_wang/pm-cli`的版本信息
```bash
$ pm --version
```

### 14. `--clean` or `-n`
彻底清除已经被删除的账号。**注**：此操作无法撤回。
```bash
$ pm --clean
```