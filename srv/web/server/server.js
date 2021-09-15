const Express = require('express')
const Morgan = require('morgan')
const CookieParser = require('cookie-parser')
const Cors = require('cors')
const MakeApi = require('./api')
const Shared = require('../../../lib/shared')
const { pick } = Shared
const { authenticate } = require('./middlewares/authenticate')
const { premiumUsersOnly } = require('./middlewares/premium_users_only')



async function makeServer({ seneca }, options) {
  const app = Express()


  app.use(Cors({
    origin: 'http://localhost:8080', // TODO: Do not hardcode this.
    credentials: true,
    optionsSuccessStatus: 200
  }))


  app.use(Morgan('combined'))


  app.use(CookieParser())


  const api = await MakeApi({ seneca }, options)
  app.use('/api', api)


  app.use((err, req, res, next) => {
    console.error(err)
    return res.sendStatus(500)
  })


  return app
}


module.exports = makeServer
