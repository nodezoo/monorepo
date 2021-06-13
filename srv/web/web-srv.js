
const Shared = require('../../lib/shared')

module.exports = web


function web(options) {
  let reload = this.export('reload/make')(require)

  Shared.messages(this, reload)
}
