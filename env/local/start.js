require('dotenv').config({ path: './env/local/.env' })


const Seneca = require('seneca')
const Model = require('../../model/model.json')
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
        fuzzy: true
      }
    }
  })
  .use('repl')
  .use('reload')
  .use('user')
  .use('member')
  .use('group')


const host = process.env.SMTP_HOST

if (null == host) {
  throw new Error('missing SMTP_HOST env var')
}


const port = process.env.SMTP_PORT

if (null == port) {
  throw new Error('missing SMTP_PORT env var')
}


const user = process.env.SMTP_USER

if (null == user) {
  throw new Error('missing SMTP_USER env var')
}


const pass = process.env.SMTP_PASS

if (null == pass) {
  throw new Error('missing SMTP_PASS env var')
}


seneca.use('simple-mail', {
  transport: {
    pool: true,
    secure: false, // <-- You might want to change that.
    host,
    port,
    auth: {
      user,
      pass
    }
  }
})


const options = {
  npm_registry_url: env_var_required('NPM_REGISTRY_URL'),
  github_url: env_var_required('GITHUB_URL'),
  github_api_url: env_var_required('GITHUB_API_URL'),

  github_client_id: env_var_required('GITHUB_CLIENT_ID'),
  github_client_secret: env_var_required('GITHUB_CLIENT_SECRET'),

  ingester: {
    sleep_ms_between_iterations: 5e3,
    sleep_ms_between_fetches: 1e3
  },

  github_srv: {
    wait_ms_on_npm: 2e3
  }
}

for(const [name, srv] of Object.entries(Model.main.srv)) {
  seneca.use('../../srv/'+name+'/'+name+'-srv.js', options)
}


seneca.ready(() => {
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
})

