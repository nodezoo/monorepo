const Seneca = require('seneca')
const Model = require('../../../../model/model.json')
const DynamoDbLib = require('../../lib/dynamo_db_lib')
const { env_var_required } = require('../../../../lib/shared')


const seneca = Seneca()
seneca.context.model = Model


seneca
  .use('promisify')

  .use('reload')

  .use('entity')


  .ignore_plugin('mem-store')

  .use('dynamo-store', {
    aws: DynamoDbLib.get_config() 
  })


  .use('../../../../srv/update/update-srv.js', {
    npm_registry_url: env_var_required('NPM_REGISTRY_URL'),

    ingester: {
      sleep_ms_between_fetches: 720,
      sleep_ms_between_iterations: 1e3
    }
  })

  .client({ pin: 'role:info', host: 'info', port: 4630 })

  .use('repl', { port: 4661, host: '0.0.0.0' })

  .listen(4660)

