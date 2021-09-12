require('dotenv').config({ path: './env/sim/.env' })
const AWS = require('aws-sdk')


module.exports = {
  connect() {
    const config = this.get_config()

    return new AWS.DynamoDB(config)
  },


  get_config() {
    const aws_access_key_id = process.env.AWS_ACCESS_KEY_ID

    if (null == aws_access_key_id) {
      throw new Error('missing AWS_ACCESS_KEY_ID env var')
    }


    const aws_secret_access_key = process.env.AWS_SECRET_ACCESS_KEY

    if (null == aws_secret_access_key) {
      throw new Error('missing AWS_SECRET_ACCESS_KEY env var')
    }


    const aws_dynamodb_endpoint = process.env.AWS_DYNAMODB_ENDPOINT

    if (null == aws_secret_access_key) {
      throw new Error('missing AWS_DYNAMODB_ENDPOINT env var')
    }


    const aws_region = process.env.AWS_REGION

    if (null == aws_region) {
      throw new Error('missing AWS_REGION env var')
    }


    return {
      accessKeyId: aws_access_key_id,
      secretAccessKey: aws_secret_access_key,
      endpoint: aws_dynamodb_endpoint,
      region: aws_region
    }
  }
}
