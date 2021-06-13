
const Shared = require('../../lib/shared')

module.exports = search


function search(options) {
  let reload = this.export('reload/make')(require)

  Shared.messages(this, reload)
}
