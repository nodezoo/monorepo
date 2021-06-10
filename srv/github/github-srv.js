
const Shared = require('../../lib/shared')


module.exports = github


function github(options) {
  let reload = this.export('reload/make')(require)

  Shared.messages(this, reload)
}
