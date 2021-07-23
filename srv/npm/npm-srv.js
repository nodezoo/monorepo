
const Shared = require('../../lib/shared')


module.exports = npm


// TODO: move to model
module.exports.defaults = {
  registry: Shared.NPM_REPLICATE_URL() + '/',
}


function npm(options) {
  let reload = this.export('reload/make')(require)

  Shared.messages(this, options, reload, require)
}

