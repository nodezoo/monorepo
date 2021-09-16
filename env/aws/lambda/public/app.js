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

  // NOTE: It is important that we wait until the Seneca instance is
  // ready. Otherwise seneca.export'ing 'gateway-express/handler'
  // will return `undefined`.
  //
  await seneca.ready()


  seneca
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


  const app = Express()

  seneca.use('../../../../srv/web_public/web_public-srv.js', {
    // NOTE: the web_public service registers HTTP endpoints on
    // the Express instance in place. Perhaps, a better option would
    // be to initialize the Express instance inside the web_public
    // service. However, exports are currently not supported on async
    // plugins:
    //
    // https://github.com/senecajs/seneca/issues/890
    app,

    gateway_express_handler:
      seneca.export('gateway-express/handler'),

    github_url: env_var_required('GITHUB_URL'),
    github_api_url: env_var_required('GITHUB_API_URL'),
    github_client_id: env_var_required('GITHUB_CLIENT_ID'),
    github_client_secret: env_var_required('GITHUB_CLIENT_SECRET')
  })

  // NOTE: Currently, this call to #ready is required. Without it,
  // web_public messages will not have enough time to get registered
  // properly.
  //
  await seneca.ready()


  return app
}


module.exports = make_app
