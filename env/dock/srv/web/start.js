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


  .use('simple-mail', {
    transport: {
      pool: true,
      secure: false, // <-- TODO: You might want to change that.
      host: env_var_required('SMTP_HOST'),
      port: env_var_required('SMTP_PORT'),
      auth: {
        user: env_var_required('SMTP_USER'),
        pass: env_var_required('SMTP_PASS') 
      }
    }
  })

  .use('../../../../srv/web/web-srv.js', {
    github_url: env_var_required('GITHUB_URL'),
    github_api_url: env_var_required('GITHUB_API_URL'),
    github_client_id: env_var_required('GITHUB_CLIENT_ID'),
    github_client_secret: env_var_required('GITHUB_CLIENT_SECRET'),

    stripe_api_key: env_var_required('STRIPE_API_KEY'),
    stripe_webhook_endpoint_secret: env_var_required('STRIPE_WEBHOOK_ENDPOINT_SECRET'),

    nodezoo_app_url: env_var_required('NODEZOO_APP_URL')
  })

  .client({ pin: 'role:group', host: 'user', port: 4670 })
  .client({ pin: 'sys:user', host: 'user', port: 4670 })
  .client({ pin: 'role:user', host: 'user', port: 4670 })
  .client({ pin: 'role:search', host: 'search', port: 4650 })
  .client({ pin: 'role:payment', host: 'payment', port: 4640 })

