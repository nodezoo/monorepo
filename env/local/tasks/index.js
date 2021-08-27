const Cron = require('node-cron')


function run({ seneca }) {
  const tasks = [
    download_pkgs_names,
    fulfill_pkgs_downloads
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
