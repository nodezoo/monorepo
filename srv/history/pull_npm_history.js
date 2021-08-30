const Assert = require('assert')
const Moment = require('moment')
const Axios = require('axios')

const {
  make_timestamp,
  is_valid_timestamp
} = require('./lib/shared')

const Shared = require('../../lib/shared')
const { today, tomorrow } = Shared


module.exports = function make_pull_npm_history(options_wrapper) {
  const { options } = options_wrapper


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


    const { date: timestamp = null } = msg

    if (!is_valid_timestamp(timestamp)) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['date'],
          why_exactly: 'required'
        }
      }
    }


    const { npm_api_url = null } = options

    if (null == npm_api_url) {
      throw new Error('missing npm_api_url option')
    }


    const date = new Date(timestamp)
    const start_date = today(date)
    const end_date = tomorrow(date)

    const start = make_timestamp(start_date)
    const end = make_timestamp(end_date)


    const history_url = `${npm_api_url}/downloads/range/` +
      `${start}:${end}/${pkg_name}`

    const stats_pull = await Axios.get(history_url, {
      responseType: 'stream'
    })


    return new Promise(async (resolve, reject) => {
      stats_pull.data.once('error', reject)


      stats_pull.data.once('data', async (stats) => {
        try {
          const { downloads } = stats

          await seneca.make('nodezoo', 'history')
            .data$({
              npm_downloads: downloads,
              name: pkg_name,
              day: make_timestamp(date)
            })
            .save$({ upsert$: ['name', 'day'] })
        } catch (err) {
          return reject(err)
        }
      })


      stats_pull.data.once('end', () => {
        return resolve({ ok: true })
      })
    })
  }
}

