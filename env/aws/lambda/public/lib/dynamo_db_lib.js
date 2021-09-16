const AWS = require('aws-sdk')
const { env_var_required } = require('../../../../../lib/shared')


module.exports = {
  connect() {
    const config = this.get_config()
    return new AWS.DynamoDB(config)
  },


  get_config() {
    return {
      accessKeyId: env_var_required('AWS_ACCESS_KEY_ID'),
      secretAccessKey: env_var_required('AWS_SECRET_ACCESS_KEY'),
      endpoint: env_var_required('AWS_DYNAMODB_ENDPOINT'),
      region: env_var_required('AWS_REGION')
    }
  }
}
