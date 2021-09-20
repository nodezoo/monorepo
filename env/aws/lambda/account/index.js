const AwsServerlessExpress = require('aws-serverless-express')
const { get_app } = require('./app')


let server = null

exports.handler = async (aws_event, aws_ctx) => {
  console.dir('aws_event') // dbg
  console.log(JSON.stringify(aws_event)) // dbg

  if (null == server) {
    const app = await get_app()
    server = AwsServerlessExpress.createServer(app)
  }


  const result = await AwsServerlessExpress
    .proxy(server, aws_event, aws_ctx, 'PROMISE')
    .promise

  return result
}

