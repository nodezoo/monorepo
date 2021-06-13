

const Shared = require('../../lib/shared')



module.exports = info


function info(options) {
  let reload = this.export('reload/make')(require)

  Shared.messages(this, reload)
}

