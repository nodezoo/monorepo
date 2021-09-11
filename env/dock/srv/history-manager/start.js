const Assert = require('assert')
const Moment = require('moment')

const Seneca = require('seneca')
const Model = require('../../../../model/model.json')

const { sleep, dedup } = require('../../../../lib/shared')
const DynamoDbLib = require('../../lib/dynamo_db_lib')
const { make_timestamp } = require('../../../../srv/history/lib/shared')
const { schedule_daily } = require('../../../../lib/shared')


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


  .client({ pin: 'role:history', host: 'history', port: 4620 })

  .ready(() => {
    setTimeout(() => {
      const tasks = [
        schedule_pull_history({ seneca })
      ]


      for (const task of tasks) {
        task.start()
      }
    }, 60e3)
  })



function schedule_pull_history({ seneca }) {
  const started_at = Moment().add(3, 'minutes').toDate()
  const hours = started_at.getHours()
  const minutes = started_at.getMinutes()

  console.dir(`pull_history, scheduled daily at: ${hours} hours ${minutes} minutes UTC`)


  return schedule_daily(
    {
      hours,
      minutes
    },

    () => pull_history({ seneca }),

    {
      scheduled: true
    }
  )
}


async function pull_history({ seneca }) {
  const now = new Date()

  console.dir(`pull_history, triggered at: ${now}`)


  const pkgs_names = await seneca.make('nodezoo', 'bookmark')
    .list$({ all$: true, fields$: ['name'] })
    .then(pkgs => {
      const names = pkgs.map(pkg => pkg.name)
      return dedup(names)
    })

  console.dir(`pull_history, located ${pkgs_names.length} bookmarked packages`)


  for (const pkg_name of pkgs_names) {
    const pkg_name = pkgs_names[i]

    seneca.act('role:history,pull:npm_history', {
      pkg_name,
      date: make_timestamp(now)
    }, (err) => {
      if (err) console.error(err)
    })

    seneca.act('role:history,pull:github_history', {
      pkg_name
    }, (err) => {
      if (err) console.error(err)
    })

    await sleep(1e3)
  }
}

