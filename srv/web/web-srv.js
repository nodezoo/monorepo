const Express = require('express')
const Path = require('path')
const Shared = require('../../lib/shared')
const MakeServer = require('./server/server')


function web(options) {
  const reload = this.export('reload/make')(require)
  Shared.messages(this, options, reload, require)


  const seneca = this
  const app = MakeServer({ seneca }) 

  app.listen(9000)
}


module.exports = web
