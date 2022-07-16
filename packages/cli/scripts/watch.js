import { watch } from 'fs'
import { exec } from 'child_process'

let timerId
const wait = 200

function clear() {
  timerId && clearTimeout(timerId)
}

function main() {
  watch('./src', (eventType, fileName) => {
    clear()
    timerId = setTimeout(() => {
      exec('yarn build').stdout.on('data', chunk => console.info(chunk))
    }, wait)
  })
}

main()