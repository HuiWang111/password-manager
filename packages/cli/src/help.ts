export const help = `
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
`