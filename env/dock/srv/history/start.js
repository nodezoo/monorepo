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


  .use('../../../../srv/history/history-srv.js', {
    npm_api_url: env_var_required('NPM_API_URL'),
    github_api_url: env_var_required('GITHUB_API_URL'),

    github_app: {
      client_id: env_var_required('GITHUB_NODEZOO_APP_CLIENT_ID'),
      client_secret: env_var_required('GITHUB_NODEZOO_APP_CLIENT_SECRET'),
      app_id: env_var_required('GITHUB_NODEZOO_APP_ID'),
      installation_id: env_var_required('GITHUB_NODEZOO_INSTALLATION_ID'),
      private_key_path: env_var_required('GITHUB_NODEZOO_PRIVATE_KEY_PATH')
    }
  })

  .use('repl', { port: 4621, host: '0.0.0.0' })

  .listen(4620)


