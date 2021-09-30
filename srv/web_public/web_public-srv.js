const Express = require('express')
const Shared = require('../../lib/shared')
const { make_api } = require('./routes/api')


function web_public(options) {
  const seneca = this


  const reload = this.export('reload/make')(require)
  Shared.messages(seneca, options, reload, require)


  const app = Express()

  app.use('/api', make_api({ seneca }, options))


  return {
    name: 'web_public',
    exports: {
      app
    }
  }
}


module.exports = web_public
