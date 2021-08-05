
const Shared = require('../../lib/shared')


module.exports = history


function history(options) {
  let reload = this.export('reload/make')(require)

  Shared.messages(this, options, reload, require)
}

