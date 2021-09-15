const Express = require('express')
const Path = require('path')
const Shared = require('../../lib/shared')
const MakeServer = require('./server/server')


async function web(options) {
  const reload = this.export('reload/make')(require)
  Shared.messages(this, options, reload, require)


  const seneca = this
  const app = await MakeServer({ seneca }, options)

  app.listen(9000)
}


module.exports = web
