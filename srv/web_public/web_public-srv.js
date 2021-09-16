const Shared = require('../../lib/shared')
const { pick } = Shared
const { make_api } = require('./routes/api')


function web_public(options) {
  const seneca = this


  const reload = this.export('reload/make')(require)
  Shared.messages(seneca, options, reload, require)


  const { app = null } = options

  if (null == app) {
    throw new Error('The "app" option is required to be an Express instance')
  }


  const api_options = pick(options, ['gateway_express_handler'])

  app.use('/api', make_api(api_options))
}


module.exports = web_public
