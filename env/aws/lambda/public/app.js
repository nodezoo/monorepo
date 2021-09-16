const Seneca = require('seneca')
const Express = require('express')
const Patrun = require('patrun')
const Model = require('../../../../model/model.json')
const { env_var_required } = require('../../../../lib/shared')


async function make_app() {
  const seneca = Seneca({ legacy: false })

  seneca.context.model = Model

  seneca
    .use('promisify')
    .use('reload')

    .use('entity')
    .use('mem-store')

    .use('user')

    .use('gateway')
    .use('gateway-express')

    .use('search-mem', {
      search: {
        fields: ['name'],
        storeFields: ['name', 'version', 'giturl', 'desc', 'readme'],
        searchOptions: {
          fuzzy: true
        }
      }
    })
    .use('../../../../srv/search/search-srv.js', {
    })

    // TODO: Do not require Seneca handlers explicitly.
    //

    .message('role:web,scope:public,register:user',
      require('../../../../srv/web/register_user.js')())

    .message('role:web,scope:public,search:pkgs',
      require('../../../../srv/web/search_pkgs.js')())

    .message('role:web,scope:public,show:pkg',
      require('../../../../srv/web/show_pkg.js')())

    .message('role:web,scope:public,request:pass_reset',
      require('../../../../srv/web/request_pass_reset.js')())

    .message('role:web,scope:public,reset:pass',
      require('../../../../srv/web/reset_pass.js')())


  // NOTE: It is important that we wait until the Seneca instance is
  // ready. Otherwise seneca.export'ing 'gateway-express/handler'
  // will return `undefined`.
  //
  await seneca.ready()


  const app = Express()


  app.post('/public',
    Express.json(),

    filter([
      { role: 'web', scope: 'public', register: 'user' },
      { role: 'web', scope: 'public', search: 'pkgs' },
      { role: 'web', scope: 'public', show: 'pkg' },
      { role: 'web', scope: 'public', request: 'pass_reset' },
      { role: 'web', scope: 'public', reset: 'pass' }
    ]),

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


function filter(whitelist) {
  const allowed = whitelist
    .reduce((acc, msg) => acc.add(msg, true), Patrun())

  return (req, res, next) => {
    const msg = req.body
    const is_allowed = allowed.find(msg)

    if (is_allowed) {
      return next()
    }

    return res.sendStatus(404)
  }
}


module.exports = make_app
