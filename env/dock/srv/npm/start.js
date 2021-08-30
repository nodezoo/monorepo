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


  .use('../../../../srv/npm/npm-srv.js', {
    npm_registry_url: env_var_required('NPM_REGISTRY_URL')
  })

  .use('repl', { port: 4611, host: '0.0.0.0' })

  .listen(4610)


