const Seneca = require('seneca')
const DynamoDbLib = require('../../lib/dynamo_db_lib')


Seneca()
  .use('entity')

  .ignore_plugin('mem-store')

  .use('dynamo-store', {
    aws: DynamoDbLib.get_config() 
  })

  .use('repl', { port: 4771, host: '0.0.0.0' })

