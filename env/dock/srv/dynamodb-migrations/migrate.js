const DynamoDbLib = require('../../lib/dynamo_db_lib')

const ddb = DynamoDbLib.connect()

/* TODO: Use the model to create the tables automatically.
 */

const schema = [
  {
    TableName: 'nodezoo_github',
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
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },

  {
    TableName: 'nodezoo_npm',
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
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },

  {
    TableName: 'nodezoo_pass_reset_token',
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH',
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S'
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },

  {
    TableName: 'nodezoo_orig',
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH',
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S'
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },

  {
    TableName: 'nodezoo_bookmark',
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH',
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S'
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },

  {
    TableName: 'nodezoo_history',
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH',
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S'
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },

  {
    TableName: 'sys_user',
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH',
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S'
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },

  {
    TableName: 'sys_login',
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH',
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S'
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },

  {
    TableName: 'sys_verify',
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH',
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S'
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },

  {
    TableName: 'sys_group',
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH',
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S'
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },

  {
    TableName: 'sys_member',
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH',
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S'
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
]


Promise.all(schema.map(table_desc => {
  return create_table(table_desc, ddb, { verbose: true })
}))
  .then(() => ddb.listTables({}).promise())
  .then(console.log)



function create_table(table_desc, ddb, opts = {}) {
  return ddb.createTable(table_desc).promise()
    .then(() => {
      if (opts.verbose) {
        const table = table_desc.TableName
        console.log('Table "' + table + '" has been created successfully.')
      }

      return
    })
    .catch(err => {
      const table = table_desc.TableName || 'undefined'
      console.error('Error creating table "' + table + '":', err.message)
    })
}

