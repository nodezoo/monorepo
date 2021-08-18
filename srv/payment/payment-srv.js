
const Shared = require('../../lib/shared')


module.exports = payment


function payment(options) {
  const reload = this.export('reload/make')(require)

  Shared.messages(this, options, reload, require)
}

