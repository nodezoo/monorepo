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


  .use('../../../../srv/info/info-srv.js', {
  })

  .client({ pin: 'role:source,source:npm', host: 'npm', port: 4610 })
  .client({ pin: 'role:source,source:github', host: 'github', port: 4600 })
  .client({ pin: 'sys:search', host: 'search', port: 4650 })

  .use('repl', { port: 4631, host: '0.0.0.0' })
  .listen(4630)


