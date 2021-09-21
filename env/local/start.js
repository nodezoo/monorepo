require('dotenv').config({ path: './env/local/.env' })


const Seneca = require('seneca')
const Model = require('../../model/model.json')

const Assert = require('assert')
const Express = require('express')

const TasksCollection = require('./tasks')
const { env_var_required } = require('../../lib/shared')


const seneca = Seneca({ log: 'flat' })
seneca.context.model = Model

seneca
  .test('print')
  .error(console.log)
  .use('promisify')
  .use('entity')
  .use('mem-store')
  .use('search-mem', {
    search: {
      fields: ['name'],
      storeFields: ['name', 'version', 'giturl', 'desc', 'readme'],
      searchOptions: {
        fuzzy: 0.2
      }
    }
  })
  .use('repl')
  .use('reload')
  .use('user')
  .use('member')
  .use('group')
  .use('simple-mail', {
    transport: {
      pool: true,
      secure: false,
      host: env_var_required('SMTP_HOST'),
      port: env_var_required('SMTP_PORT'),
      auth: {
        user: env_var_required('SMTP_USER'),
        pass: env_var_required('SMTP_PASS')
      }
    }
  })


const options = {
  npm_api_url: env_var_required('NPM_API_URL'),
  npm_registry_url: env_var_required('NPM_REGISTRY_URL'),

  github_url: env_var_required('GITHUB_URL'),
  github_api_url: env_var_required('GITHUB_API_URL'),

  github_client_id: env_var_required('GITHUB_CLIENT_ID'),
  github_client_secret: env_var_required('GITHUB_CLIENT_SECRET'),

  stripe_api_key: env_var_required('STRIPE_API_KEY'),
  stripe_webhook_endpoint_secret: env_var_required('STRIPE_WEBHOOK_ENDPOINT_SECRET'),

  nodezoo_app_url: env_var_required('NODEZOO_APP_URL'),

  ingester: {
    sleep_ms_between_iterations: 10e3,
    sleep_ms_between_fetches: 0
  },

  github_srv: {
    wait_ms_on_npm: 2e3
  }
}

for (const [name, srv] of Object.entries(Model.main.srv)) {
  if ('auto_use' in srv && !srv.auto_use) {
    continue
  }

  seneca.use('../../srv/'+name+'/'+name+'-srv.js', options)
}


seneca.ready(async () => {
  // NOTE: Creating the Premium Users group.
  //
  seneca.act('make:group,role:group', {
    owner_id: null,

    group: {
      name: 'Premium Users',
      mark: 'pu',
      code: 'PremiumUsers'
    },

    unique: true
  }, err => {
    if (err) {
      throw err
    }
  })


  const public_seneca = await make_public_seneca(seneca)
  await public_seneca.ready()
  const public_app = public_seneca.export('web_public/app')
  Assert(public_app, 'public app must be an Express instance')


  const account_seneca = await make_account_seneca(seneca)
  await account_seneca.ready()
  const account_app = account_seneca.export('web_account/app')
  Assert(account_app, 'account app must be an Express instance')


  // NOTE: Scheduling the tasks.
  //
  TasksCollection.run({ seneca })


  const server = Express()
    .use(public_app)
    .use(account_app)
    .listen(9000, () => {
      console.dir('Listening...')
      console.log('The Express server is listening at %j', server.address())
    })
})


async function make_public_seneca(seneca) {
  const public_seneca = Seneca({ legacy: false })
  public_seneca.context.model = Model


  public_seneca
    .use('promisify')
    .use('reload')

    .use('gateway')
    .use('gateway-express')


  // NOTE: It is important that we wait until the Seneca instance is
  // ready. Otherwise seneca.export'ing 'gateway-express/handler'
  // will return `undefined`.
  //
  await public_seneca.ready()

  const gateway_express_handler =
    public_seneca.export('gateway-express/handler')



  public_seneca
    .use('../../srv/web_public/web_public-srv.js', {
      gateway_express_handler,

      nodezoo_app_url: env_var_required('NODEZOO_APP_URL'),
      github_url: env_var_required('GITHUB_URL'),
      github_api_url: env_var_required('GITHUB_API_URL'),
      github_client_id: env_var_required('GITHUB_CLIENT_ID'),
      github_client_secret: env_var_required('GITHUB_CLIENT_SECRET')
    })


  public_seneca
    .add('role:user', (msg, reply) => seneca.root.act(msg, reply))
    .add('sys:user', (msg, reply) => seneca.root.act(msg, reply))
    .add('role:search', (msg, reply) => seneca.root.act(msg, reply))
    .add('sys:mail', (msg, reply) => seneca.root.act(msg, reply))
    .add('role:entity', (msg, reply) => seneca.root.act(msg, reply))

  return public_seneca
}


async function make_account_seneca(seneca) {
  const account_seneca = Seneca({ legacy: false })
  account_seneca.context.model = Model


  account_seneca
    .use('promisify')
    .use('reload')

    .use('gateway')
    .use('gateway-express')
    .use('gateway-express-auth', {
      cookie: {
        name: 'AUTH_TOKEN'
      }
    })


  // NOTE: It is important that we wait until the Seneca instance is
  // ready. Otherwise seneca.export'ing 'gateway-express/handler'
  // will return `undefined`.
  //
  await account_seneca.ready()

  const gateway_express_handler =
    account_seneca.export('gateway-express/handler')


  account_seneca
    .use('../../srv/web_account/web_account-srv.js', {
      gateway_express_handler,

      nodezoo_app_url: env_var_required('NODEZOO_APP_URL'),
      stripe_api_key: env_var_required('STRIPE_API_KEY'),

      stripe_webhook_endpoint_secret:
        env_var_required('STRIPE_WEBHOOK_ENDPOINT_SECRET')
    })


  account_seneca
    .add('sys:user', (msg, reply) => seneca.root.act(msg, reply))
    .add('sys:mail', (msg, reply) => seneca.root.act(msg, reply))
    .add('role:member', (msg, reply) => seneca.root.act(msg, reply))
    .add('role:group', (msg, reply) => seneca.root.act(msg, reply))
    .add('role:user', (msg, reply) => seneca.root.act(msg, reply))
    .add('role:payment', (msg, reply) => seneca.root.act(msg, reply))
    .add('role:history', (msg, reply) => seneca.root.act(msg, reply))
    .add('role:entity', (msg, reply) => seneca.root.act(msg, reply))

  return account_seneca
}

