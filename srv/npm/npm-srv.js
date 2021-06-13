
const Shared = require('../../lib/shared')


module.exports = npm


/*

https://stackoverflow.com/questions/39190442/how-do-i-add-trigger-to-an-aws-lambda-function-using-aws-cli/52279886

if(process.env.NODEZOO_SRV) {
  const SNS = new AWS.SNS({apiVersion: '2010-03-31'})
  async function init() {
    let out = await SNS.subscribe({
      Protocol: 'lambda',
      TopicArn: 'arn:aws:sns:us-east-1:...:nodezoo_collect_part_role_info',
      Endpoint: 'arn:aws:lambda:us-east-1:...:function:nodezoo_npm'
    }).promise()
    console.log('INIT', out)
  }
  init()
}
*/

function npm(options) {
  let reload = this.export('reload/make')(require)

  Shared.messages(this, reload, require)

  // this.message('role:source,source:npm,get:package', require('./get_package.js')())
  //this.message('role:source,source:npm,get:package', reload('./get_package.js'))
}

