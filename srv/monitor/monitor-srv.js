
const Shared = require('../../lib/shared')


module.exports = monitor


function monitor(options) {
  let reload = this.export('reload/make')(require)

  Shared.messages(this, options, reload, require)
}

