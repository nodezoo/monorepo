const AWS = require('aws-sdk')
const Model = require('../../../model/model.json')

// NOTE: set AWS_PROFILE
var config = {
  region: 'us-east-1',
}

AWS.config.update(config)


var ddb = new AWS.DynamoDB()
ddb.listTables({},console.log)


const ents = Model.main.ent.nodezoo

for(name in ents) {
  const ent = ents[name]
  let fullname = 'nodezoo_'+name
  console.log('TABLE:',fullname)

  let schema = {
    TableName: fullname,
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH',
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S',
      },
    ],
    BillingMode: 'PAY_PER_REQUEST'
  }

  console.log('SCHEMA:',schema)
  
  ddb.createTable(
    schema,
    console.log
  )
}
