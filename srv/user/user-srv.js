const Shared = require('../../lib/shared')


module.exports = user


function user(options) {
  const reload = this.export('reload/make')(require)

  Shared.messages(this, options, reload, require)
}

