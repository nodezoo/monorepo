
const Shared = require('../../lib/shared')


module.exports = npm


// TODO: move to model
module.exports.defaults = {
  registry: 'https://replicate.npmjs.com/',
}


function npm(options) {
  let reload = this.export('reload/make')(require)

  Shared.messages(this, options, reload, require)
}

