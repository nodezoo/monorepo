const Seneca = require('seneca')
const Express = require('express')


async function make_app() {
  const seneca = Seneca({ legacy: false })
    .use('promisify')
    .use('gateway')
    .use('gateway-express')


  // NOTE: It is important that we wait until the Seneca instance is
  // ready. Otherwise seneca.export'ing 'gateway-express/handler' will
  // return `undefined`.
  //
  await seneca.ready()


  const app = Express()


  app.post('/account',
    Express.json(),
    seneca.export('gateway-express/handler'))


  app.use((err, req, res, next) => {
    const is_seneca_err = Boolean(err?.seneca$)

    if (is_seneca_err) {
      const not_found = ['act_not_found', 'not_allowed'].includes(err?.code$)

      if (not_found) {
        return res.sendStatus(404)
      }
    }


    return next(err)
  })


  return app
}


module.exports = make_app
