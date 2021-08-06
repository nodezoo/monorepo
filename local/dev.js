const Seneca = require('seneca')
const Model = require('../model/model.json')


const seneca = Seneca({ log: 'flat' })
seneca.context.model = Model

seneca
  .test('print')
  .error(console.log)
  .use('promisify')
  .use('entity')
  .use('mem-store')
  .use('repl')
  .use('reload')
  .use('user')


/**
 * WARNING: TODO:
 * This is for testing purposes ONLY.
 * Please remove this once the frontend has been implemented.
 */
if (process.env.DEV_SQLITE_DB) {
  const SqliteStore = require('seneca-sqlite-store')

  seneca.use(SqliteStore, {
    database: process.env.DEV_SQLITE_DB
  })
}
/*
 **/


const options = {
  npm_registry_url: 'https://replicate.npmjs.com',

  ingester: {
    sleep_ms_between_iterations: 5e3,
    sleep_ms_between_fetches: 1e3
  },

  github_srv: {
    wait_ms_on_npm: 2e3
  }
}

for(const [name, srv] of Object.entries(Model.main.srv)) {
  seneca.use('../srv/'+name+'/'+name+'-srv.js', options)
}
