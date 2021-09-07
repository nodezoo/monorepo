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


  .use('user')

  .use('member')

  .use('group')

  .use('../../../../srv/user/user-srv.js', {
  })

  .ready(() => {

    // NOTE: Creating the Premium Users group.
    //
    seneca

      .act('make:group,role:group', {
        owner_id: null,
        group: { name: 'Premium Users', mark: 'pu', code: 'PremiumUsers' },
        unique: true
      }, err => {
        if (err) {
          throw err
        }
      })

      .use('repl', { port: 4671, host: '0.0.0.0' })

      .listen(4670)
  })

