const Seneca = require('seneca')
const Model = require('../../../../model/model.json')
const DynamoDbLib = require('../../lib/dynamo_db_lib')
const { env_var_required } = require('../../../../lib/shared')


const seneca = Seneca()
seneca.context.model = Model


seneca
  .use('promisify')

  .use('reload')


  .use('search-mem', {
    search: {
      fields: ['name'],
      storeFields: ['name', 'version', 'giturl', 'desc', 'readme'],
      searchOptions: {
        fuzzy: true
      }
    }
  })

  .use('../../../../srv/search/search-srv.js', {
  })

  .use('repl', { port: 4651, host: '0.0.0.0' })

  .listen(4650)


