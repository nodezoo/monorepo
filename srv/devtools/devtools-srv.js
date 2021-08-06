const Shared = require('../../lib/shared')


module.exports = devtools


function devtools(options) {
  const reload = this.export('reload/make')(require)

  Shared.messages(this, options, reload, require)
}

