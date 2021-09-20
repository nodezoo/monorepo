const Seneca = require('seneca')
const Patrun = require('patrun')
const Model = require('/opt/nodejs/model/model.json')
const { env_var_required } = require('/opt/nodejs/lib/shared')
const DynamoDbLib = require('./lib/dynamo_db_lib')


async function get_app() {
  const seneca = await get_seneca()
  return seneca.export('web_account/app')
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
    .use('promisify')
    .use('reload')


    .use('entity')

    .ignore_plugin('mem-store')

    .use('dynamo-store', get_dynamo_store_config())


    .use('gateway')
    .use('gateway-express')

    .use('gateway-express-auth', {
      cookie: {
        name: 'AUTH_TOKEN'
      },

      seneca_auth: () => seneca
    })

  // NOTE: It is important that we wait until the Seneca instance is
  // ready. Otherwise seneca.export'ing 'gateway-express/handler'
  // will return `undefined`.
  //
  await seneca.ready()

  const gateway_express_handler = seneca.export('gateway-express/handler')


  seneca.use('simple-mail', {
    transport: {
      pool: true,
      secure: false, // TODO: <-- You might want to change that.
      host: env_var_required('SMTP_HOST'),
      port: env_var_required('SMTP_PORT'),
      auth: {
        user: env_var_required('SMTP_USER'),
        pass: env_var_required('SMTP_PASS')
      }
    }
  })


  seneca
    .use('member')
    .use('group')

    .use('user')
    .use('/opt/nodejs/srv/user/user-srv.js', {
    })


  seneca
    .use('/opt/nodejs/srv/payment/payment-srv.js', {
    })


  seneca
    .use('/opt/nodejs/srv/history/history-srv.js', {
      npm_api_url: env_var_required('NPM_API_URL'),
      github_api_url: env_var_required('GITHUB_API_URL'),

      github_app: {
        client_id: env_var_required('GITHUB_NODEZOO_APP_CLIENT_ID'),
        client_secret: env_var_required('GITHUB_NODEZOO_APP_CLIENT_SECRET'),
        app_id: env_var_required('GITHUB_NODEZOO_APP_ID'),
        installation_id: env_var_required('GITHUB_NODEZOO_INSTALLATION_ID'),
        private_key_path: env_var_required('GITHUB_NODEZOO_PRIVATE_KEY_PATH')
      }
    })



/*
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
    .use('/opt/nodejs/srv/search/search-srv.js', {
    })
*/


  seneca
    .use('/opt/nodejs/srv/web_account/web_account-srv.js', {
      gateway_express_handler,

      nodezoo_app_url: env_var_required('NODEZOO_APP_URL'),
      stripe_api_key: env_var_required('STRIPE_API_KEY'),

      stripe_webhook_endpoint_secret:
        env_var_required('STRIPE_WEBHOOK_ENDPOINT_SECRET')

      /*
      github_url: env_var_required('GITHUB_URL'),
      github_api_url: env_var_required('GITHUB_API_URL'),
      github_client_id: env_var_required('GITHUB_CLIENT_ID'),
      github_client_secret: env_var_required('GITHUB_CLIENT_SECRET')
      */
    })

  // NOTE: It is important that we wait until the Seneca instance is
  // ready. Otherwise web_account messages will not have enough time
  // to get registered properly.
  //
  await seneca.ready()

  return seneca
}


function get_dynamo_store_config() {
  if ('production' === process.env.NODE_ENV) {
    return {
      aws: { default: true },
      dc: { default: true }
    }
  }

  return {
    aws: DynamoDbLib.get_config()
  }
}


module.exports = { get_app }
