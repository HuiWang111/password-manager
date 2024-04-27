const childProcess = require('child_process')
const nodePath = require('path')

async function runCommand (command, { cwd = process.cwd(), stdio = 'inherit', beforeRun } = {
  cwd: process.cwd(),
  stdio: 'inherit',
}) {
  return new Promise((resolve, reject) => {
    const shouldToRun = beforeRun && beforeRun(command)
    if (shouldToRun === false) {
      return
    }
    const [cmd, ...args] = command.split(' ')
    let data = ''
    const app = (0, childProcess.spawn)(cmd, args, {
      cwd,
      stdio: stdio === null ? undefined : stdio,
      shell: process.platform === 'win32',
    })
    const onProcessExit = () => app.kill('SIGHUP')
    app.stdout && app.stdout.on('data', (message) => {
      if (stdio == null) {
        data += message
      }
    })
    app.on('close', (code) => {
      process.removeListener('exit', onProcessExit)
      if (code === 0)
        resolve(stdio == null ? data : undefined)
      else
        reject(new Error(`Command failed. \n Command: ${command} \n Cwd: ${cwd} \n Code: ${code}`))
    })
    process.on('exit', onProcessExit)
  })
}
exports.runCommand = runCommand

const processCwd = process.cwd()
function getCwdPath (path) {
  if (!path)
    return processCwd
  return nodePath.join(processCwd, path)
}
exports.getCwdPath = getCwdPath
