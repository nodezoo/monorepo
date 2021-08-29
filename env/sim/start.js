require('dotenv').config({ path: './env/sim/.env' })


const Seneca = require('seneca')
const DynamoDbLib = require('./lib/dynamo_db_lib')
const Model = require('../../model/model.json')
const TasksCollection = require('./tasks')


const seneca = Seneca({ log: 'flat' })
seneca.context.model = Model

seneca
  .test('print')
  .error(console.log)
  .use('promisify')
  .use('entity')

/* TODO: Re-enable dynamo-store after testing's been completed.
 *
seneca
  .ignore_plugin('mem-store')
  .use('dynamo-store', {
    aws: DynamoDbLib.get_config() 
  })
*/
seneca.use('mem-store') // dbg


const aws_cloudsearch_endpoint = process.env.AWS_CLOUDSEARCH_ENDPOINT

if (null == aws_cloudsearch_endpoint) {
  throw new Error('missing AWS_CLOUDSEARCH_ENDPOINT env var')
}


const aws_region = process.env.AWS_REGION

if (null == aws_region) {
  throw new Error('missing AWS_REGION env var')
}

seneca
  .use('search-aws-cloudsearch', {
    csd: {
      endpoint: aws_cloudsearch_endpoint,
      region: aws_region
    }
  })


seneca
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


const npm_registry_url = process.env.NPM_REGISTRY_URL

if (null == npm_registry_url) {
  throw new Error('missing NPM_REGISTRY_URL env var')
}


const github_api_url = process.env.GITHUB_API_URL

if (null == github_api_url) {
  throw new Error('missing GITHUB_API_URL env var')
}


const github_client_id = process.env.GITHUB_CLIENT_ID

if (null == github_client_id) {
  throw new Error('missing GITHUB_CLIENT_ID env var')
}


const github_client_secret = process.env.GITHUB_CLIENT_SECRET

if (null == github_client_secret) {
  throw new Error('missing GITHUB_CLIENT_SECRET env var')
}


const gh_app_client_id = process.env.GITHUB_NODEZOO_APP_CLIENT_ID

if (null == gh_app_client_id) {
  throw new Error('missing GITHUB_NODEZOO_APP_CLIENT_ID env var')
}

const gh_app_client_secret = process.env.GITHUB_NODEZOO_APP_CLIENT_SECRET

if (null == gh_app_client_secret) {
  throw new Error('missing GITHUB_NODEZOO_APP_CLIENT_SECRET env var')
}

const gh_app_id = process.env.GITHUB_NODEZOO_APP_ID

if (null == gh_app_id) {
  throw new Error('missing GITHUB_NODEZOO_APP_ID env var')
}

const gh_app_installation_id = process.env.GITHUB_NODEZOO_INSTALLATION_ID

if (null == gh_app_installation_id) {
  throw new Error('missing GITHUB_NODEZOO_INSTALLATION_ID env var')
}

const gh_app_private_key_path = process.env.GITHUB_NODEZOO_PRIVATE_KEY_PATH

if (null == gh_app_private_key_path) {
  throw new Error('missing GITHUB_NODEZOO_PRIVATE_KEY_PATH env var')
}


const options = {
  github_app: {
    client_id: gh_app_client_id,
    client_secret: gh_app_client_secret,
    app_id: gh_app_id,
    installation_id: gh_app_installation_id,
    private_key_path: gh_app_private_key_path
  },

  npm_registry_url,
  github_api_url,

  github_client_id,
  github_client_secret,

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
    group: { name: 'Premium Users', mark: 'pu', code: 'PremiumUsers' },
    unique: true
  }, err => {
    if (err) {
      throw err
    }
  })

  // NOTE: Scheduling the tasks.
  //
  //TasksCollection.run({ seneca })
})

