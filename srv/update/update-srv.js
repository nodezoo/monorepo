const Shared = require('../../lib/shared')


module.exports = update


function update(options) {
  let reload = this.export('reload/make')(require)

  Shared.messages(this, options, reload, require)
}

