const Express = require('express')
const Morgan = require('morgan')
const CookieParser = require('cookie-parser')
const Cors = require('cors')
const Shared = require('../../../lib/shared')
const { pick } = Shared
const { filter } = require('./middlewares/filter')
const makeStripeApi = require('./api-stripe.js')


function make_api(args, options = {}) {
  const { seneca = null } = args

  if (null == seneca || !seneca.isSeneca) {
    throw new Error(
      'The seneca arg is required and should be a Seneca instance'
    )
  }


  const { nodezoo_app_url = null } = options

  if (null == nodezoo_app_url) {
    throw new Error('The nodezoo_app_url option is required')
  }


  const api = new Express.Router()


  api.use(Cors({
    origin: nodezoo_app_url,
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: [
      'content-type', 'accept', 'origin', 'cookie',
       'Set-cookie'
    ]
  }))


  api.use(Morgan('combined'))


  api.use(CookieParser())


  const { gateway_express_handler = null } = options

  if (null == gateway_express_handler) {
    throw new Error('The "gateway_express_handler" option is required')
  }


  api.options('/account')

  api.post('/account',
    Express.json(),

    filter([
      { role: 'web', scope: 'account', logout: 'user' },
      { role: 'web', scope: 'account', list: 'pkg_history' },
      { role: 'web', scope: 'account', list: 'bookmarks' },
      { role: 'web', scope: 'account', bookmark: 'pkg' },
      { role: 'web', scope: 'account', remove: 'bookmark' },
      { role: 'web', scope: 'account', load: 'profile' },
      { role: 'web', scope: 'account', is: 'premium' }
    ]),
    
    gateway_express_handler)


  api.use('/stripe', makeStripeApi({ seneca }, options))


  api.use((err, req, res, next) => {
    console.error(err)


    const is_seneca_err = Boolean(err?.seneca$)

    if (is_seneca_err) {
      const not_found = ['act_not_found', 'not_allowed'].includes(err?.code$)

      if (not_found) {
        return res.sendStatus(404)
      }
    }


    return res.sendStatus(500)
  })


  return api
}


module.exports = { make_api }
