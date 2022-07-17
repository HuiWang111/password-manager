export const help = `
  Usage
    $ pm [<options> ...]

  Options
      none             Display account list
    --create, -c       Create an account
    --delete, -d       Delete some accounts
    --copy, -y         Copy password of an account
    --show, -s         Display account list
    --remark, -k      Add remark to an account
    --help, -h         Display help message
    --find, -f         Search for accounts
    --move, -m         Move account between boards
    --archive, -a      Display archived accounts
    --edit, -e         Edit account password
    --restore, -r      Restore accounts from archive
    --version, -v      Display installed version
    --clean, -n        clear all archived accounts

  Example
    $ pm
    $ pm --create @mine 11@qq.com 123456
    $ pm --delete 1
    $ pm --copy 1
    $ pm --show 1
    $ pm --remark 1 this is my qq account
    $ pm --help
    $ pm --find qq.com
    $ pm --move @1 xiaoming
    $ pm --archive
    $ pm --edit @1 67890
    $ pm --restore 4
    $ pm --version
    $ pm --clean
`