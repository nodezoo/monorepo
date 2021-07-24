
const Shared = require('../../lib/shared')


module.exports = npm



function npm(options) {
  let reload = this.export('reload/make')(require)

  Shared.messages(this, options, reload, require)
}

