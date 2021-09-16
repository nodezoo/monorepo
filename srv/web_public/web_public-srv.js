const Express = require('express')
const Shared = require('../../lib/shared')
const { pick } = Shared
const { make_api } = require('./routes/api')


function web_public(options) {
  const seneca = this


  const reload = this.export('reload/make')(require)
  Shared.messages(seneca, options, reload, require)


  const app = Express()

  const api_options = pick(options, ['gateway_express_handler'])
  app.use('/api', make_api(api_options))


  return {
    name: 'web_public',
    exports: {
      app
    }
  }
}


module.exports = web_public
