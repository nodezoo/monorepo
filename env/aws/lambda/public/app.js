const Seneca = require('seneca')
const Patrun = require('patrun')
const Model = require('../../../../model/model.json')
const { env_var_required } = require('../../../../lib/shared')


async function get_app() {
  const seneca = await get_seneca()
  return seneca.export('web_public/app')
}


let seneca = null

async function get_seneca() {
  if (null == seneca) {
    seneca = await make_seneca()
  }

  return seneca
}


async function make_seneca() {
  const seneca = Seneca({ legacy: false })
  seneca.context.model = Model

  seneca
    .use('repl', { port: 3737 }) // DBG, TODO: remove this

    .use('promisify')
    .use('reload')

    .use('entity')
    .use('mem-store')

    .use('gateway')
    .use('gateway-express')

  // NOTE: It is important that we wait until the Seneca instance is
  // ready. Otherwise seneca.export'ing 'gateway-express/handler'
  // will return `undefined`.
  //
  await seneca.ready()

  const gateway_express_handler = seneca.export('gateway-express/handler')


  seneca
    .use('user')
    .use('../../../../srv/user/user-srv.js', {
    })


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


  seneca.use('../../../../srv/web_public/web_public-srv.js', {
    gateway_express_handler,

    github_url: env_var_required('GITHUB_URL'),
    github_api_url: env_var_required('GITHUB_API_URL'),
    github_client_id: env_var_required('GITHUB_CLIENT_ID'),
    github_client_secret: env_var_required('GITHUB_CLIENT_SECRET')
  })

  // NOTE: It is important that we wait until the Seneca instance is
  // ready. Otherwise web_public messages will not have enough time
  // to get registered properly.
  //
  await seneca.ready()

  return seneca
}


module.exports = { get_app }
