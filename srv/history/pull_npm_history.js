const Assert = require('assert')
const Moment = require('moment')
const NpmDownloadStats = require('download-stats')
const { make_timestamp } = require('./lib/shared')
const Shared = require('../../lib/shared')
const { today, tomorrow } = Shared


module.exports = function make_pull_npm_history() {
  return async function pull_npm_history(msg) {
    const seneca = this


    if ('string' !== typeof msg.pkg_name) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['pkg_name'],
          why_exactly: 'required'
        }
      }
    }

    const { pkg_name } = msg


    return new Promise((resolve, _reject) => {
      const day = today()
      const stats_pull = NpmDownloadStats.get(day, tomorrow(), pkg_name)


      stats_pull.once('error', err => {
        console.error(err)
        return resolve({ ok: false, why: 'internal' })
      })


      stats_pull.once('data', async (stats) => {
        try {
          const { downloads } = stats

          await seneca.make('nodezoo', 'history')
            .data$({
              npm_downloads: downloads,
              name: pkg_name,
              day: make_timestamp(day)
            })
            .save$({ upsert$: ['name', 'day'] })
        } catch (err) {
          console.error(err)
          return resolve({ ok: false, why: 'internal' })
        }
      })


      stats_pull.once('end', () => {
        return resolve({ ok: true })
      })
    })
  }
}

