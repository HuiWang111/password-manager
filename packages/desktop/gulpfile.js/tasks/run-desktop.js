const { exec } = require('child_process')

function runDesktop() {
  return exec('electron .')
}

module.exports = runDesktop