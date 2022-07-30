const runWeb = require('./tasks/run-web')
const runDesktop = require('./tasks/run-desktop')
const { parallel } = require('gulp')

exports.default = parallel(runWeb, runDesktop)
