const Assert = require('assert')
const Moment = require('moment')

const Seneca = require('seneca')
const Model = require('../../../../model/model.json')

const { sleep } = require('../../../../lib/shared')
const DynamoDbLib = require('../../lib/dynamo_db_lib')
const { make_timestamp } = require('../../../../srv/history/lib/shared')


const seneca = Seneca()
seneca.context.model = Model


seneca
  .use('promisify')

  .use('reload')

  .client({ pin: 'role:update', host: 'update', port: 4660 })

  .ready(() => {
    setTimeout(() => {
      console.dir('update-manager: initiating download')

      // NOTE: The limit is specified for the demo purposes only.
      // TODO: Remove the limit when deploying.
      //
      seneca.act('role:update,start:download', { limit: 2 })


      console.dir('update-manager: initiating the follower loop')

      seneca.act('role:update,start:follow')


      console.dir('update-manager: initiating the ingestion loop')

      seneca.act('role:update,start:ingest', {
        sleep_ms_between_fetches: 720,
        sleep_ms_between_iterations: 10e3
      })
    }, 30e3)
  })

