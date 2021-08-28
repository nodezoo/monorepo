require('dotenv').config({ path: './env/sim/.env' })


const Seneca = require('seneca')
const DynamoDbLib = require('./lib/dynamo_db_lib')
const Model = require('../../model/model.json')


const seneca = Seneca({ log: 'flat' })
seneca.context.model = Model

seneca
  .test('print')
  .error(console.log)
  .use('promisify')
  .use('entity')

seneca
  .ignore_plugin('mem-store')
  .use('dynamo-store', {
    aws: DynamoDbLib.get_config() 
  })


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
  console.error('missing NPM_REGISTRY_URL env var')
  return process.exit(1)
}


const github_registry_url = process.env.GITHUB_REGISTRY_URL

if (null == github_registry_url) {
  console.error('missing GITHUB_REGISTRY_URL env var')
  return process.exit(1)
}

const options = {
  npm_registry_url,
  github_registry_url,

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
      console.error(err)
      process.exit(1)
    }
  })

  // NOTE: Pulling the list of packages.
  //
  seneca.act('role:update,start:download')

  // NOTE: Pulling packages' data.
  //
  seneca.act('role:update,start:ingest')
})

