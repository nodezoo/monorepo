const Cron = require('node-cron')
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
  // NOTE: should be daily in the non-local environments.
  //
  return schedule_every_thirty_seconds(async () => {
    const pkgs = await seneca.make('nodezoo', 'npm')
      .list$({ all$: true, fields$: ['name'] })

    for (const pkg of pkgs) {
      const { name: pkg_name } = pkg

      seneca.act('role:history,pull:npm_history', {
        pkg_name,
        date: make_timestamp(new Date())
      }, (err) => {
        if (err) console.error(err)
      })

      await sleep(500)
    }
  })
}


function pull_github_history({ seneca }) {
  // NOTE: should be daily in the non-local environments.
  //
  return schedule_every_thirty_seconds(async () => {
    const pkgs = await seneca.make('nodezoo', 'npm')
      .list$({ all$: true, fields$: ['name'] })

    for (const pkg of pkgs) {
      const { name: pkg_name } = pkg

      seneca.act('role:history,pull:github_history', {
        pkg_name
      }, (err) => {
        if (err) console.error(err)
      })

      await sleep(1e3)
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
