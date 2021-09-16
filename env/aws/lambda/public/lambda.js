const AwsServerlessExpress = require('aws-serverless-express')
const MakeApp = require('./app')


let server

exports.handler = async (aws_event, aws_ctx) => {
  if (null == server) {
    const app = await MakeApp()
    server = AwsServerlessExpress.createServer(app)
  }

  const result = await AwsServerlessExpress
    .proxy(server, aws_event, aws_ctx, 'PROMISE')
    .promise

  return result
}

