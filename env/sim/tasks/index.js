const Cron = require('node-cron')
const Moment = require('moment')
const { sleep } = require('../../../lib/shared')
const { make_timestamp } = require('../../../srv/history/lib/shared')


function run({ seneca }) {
  const tasks = [
    download_pkgs_names,
    fulfill_pkgs_downloads,
    pull_npm_history,
    pull_github_history
  ].map(t => t({ seneca }))

  for (const task of tasks) {
    task.start()
  }
}


function download_pkgs_names({ seneca }) {
  return schedule_once(() => {
    console.dir(`download_pkgs_names, triggered at ${new Date()}`)
    seneca.act('role:update,start:download,all:true')
  })
}


function fulfill_pkgs_downloads({ seneca }) {
  return schedule_every_thirty_seconds(() => {
    seneca.act('role:update,start:ingest', {
      resume: true,
      once: true
    })
  })
}


function pull_npm_history({ seneca }) {
  const now = new Date()

  const started_at = Moment(now).add(2, 'minutes').toDate()
  const started_at_hrs = started_at.getHours()
  const started_at_mins = started_at.getMinutes()

  const scheduled_daily = `${started_at_mins} ${started_at_hrs} * * *`

  return Cron.schedule(scheduled_daily, async () => {
    const now = new Date()

    console.dir(`pull_npm_history, triggered at: ${now}`)


    const pkgs = await seneca.make('nodezoo', 'npm')
      .list$({ all$: true, fields$: ['name'] })

    console.dir(`pull_npm_history, located ${pkgs.length} packages`)


    for (let i = 0; i < pkgs.length; i++) {
      const pkg = pkgs[i]
      const { name: pkg_name } = pkg

      seneca.act('role:history,pull:npm_history', {
        pkg_name,
        date: make_timestamp(now)
      }, (err) => {
        if (err) console.error(err)
      })


      if (0 < i && 0 === i % 1000) {
        console.dir('pull_npm_history, reached a package that is a multiple of 1000, waiting...')
        await sleep(30e3)
      } else if (0 < i && 0 === i % 100) {
        console.dir('pull_npm_history, reached a package that is a multiple of 100, waiting...')
        await sleep(1000)
      } else {
        await sleep(100)
      }
    }
  }, {
    scheduled: true
  })
}


function pull_github_history({ seneca }) {
  // TODO: Make this an env var:
  //
  const GITHUB_HOURLY_RATE_LIMIT = 5000


  const MS_IN_HOUR = 60 * 60 * 1e3
  const iter_sleep_ms = Math.ceil(MS_IN_HOUR / GITHUB_HOURLY_RATE_LIMIT)


  const now = new Date()

  const started_at = Moment(now).add(2, 'minutes').toDate()
  const started_at_hrs = started_at.getHours()
  const started_at_mins = started_at.getMinutes()

  const scheduled_daily = `${started_at_mins} ${started_at_hrs} * * *`

  return Cron.schedule(scheduled_daily, async () => {
    console.dir(`pull_github_history, triggered at: ${new Date()}`)


    const pkgs = await seneca.make('nodezoo', 'npm')
      .list$({ all$: true, fields$: ['name'] })

    console.dir(`pull_npm_history, located ${pkgs.length} packages`)


    for (let i = 0; i < pkgs.length; i++) {
      if (GITHUB_HOURLY_RATE_LIMIT <= i) {
        const now = new Date()
        const next_hour = Moment(now).startOf('hour').add(1, 'hour').toDate()
        const ms_till_next_hour = Moment(next_hour).diff(now)

        console.dir('pull_github_history, reached an estimated rate limit...')
        console.dir(`pull_github_history, sleeping until ${next_hour}`)
        console.dir(`pull_github_history, will sleep for ${ms_till_next_hour} ms`)

        await sleep(ms_till_next_hour)

        console.dir('pull_github_history, woke up')
      }

      const pkg = pkgs[i]
      const { name: pkg_name } = pkg

      seneca.act('role:history,pull:github_history', {
        pkg_name
      }, (err) => {
        if (err) console.error(err)
      })

      await sleep(iter_sleep_ms)
    }
  })
}


function schedule_once(action, opts) {
  const task = Cron.schedule('* * * * * *', () => {
    action()
    task.stop()
  }, opts)

  return task
}


function schedule_every_thirty_seconds(action, opts) {
  return Cron.schedule('*/30 * * * * *', action, opts)
}


module.exports = { run }
