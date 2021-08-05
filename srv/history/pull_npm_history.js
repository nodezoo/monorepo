const Assert = require('assert')
const NpmDownloadStats = require('download-stats')
const Shared = require('../../lib/shared')
const { startOfDayUTC, nextDay, isValidDate } = Shared


module.exports = function make_pull_npm_history() {
  return async function pull_npm_history(msg) {
    const seneca = this


    if (null == msg.day || !isValidDate(new Date(msg.day))) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['day'],
          why_exactly: 'required'
        }
      }
    }


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


    return new Promise((resolve, _reject) => {
      const { pkg_name } = msg
      const day = startOfDayUTC(msg.day)
      const stats_pull = NpmDownloadStats.get(day, nextDay(day), pkg_name)


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
              day: day.toISOString()
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

