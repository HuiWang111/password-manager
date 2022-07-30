const { exec } = require('child_process')

function runWeb() {
  return exec('vite')
}

module.exports = runWeb
