const {
  pick,
} = require('../../lib/shared')

const { 
  is_valid_timestamp
} = require('./lib/shared')


const NUM_DAYS_IN_LEAP_YEAR = 366


module.exports = function make_list_history() {
  return async function list_history(msg) {
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


    if (!is_valid_timestamp(msg.since)) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['since'],
          why_exactly: 'required'
        }
      }
    }

    const { since } = msg

    const ents = await seneca.make('nodezoo', 'history')
      .list$({
        day: { gte$: since },
        limit$: NUM_DAYS_IN_LEAP_YEAR
      })

    const history = ents.map(ent => pick(ent, [
      'name',
      'day',
      'npm_downloads',
      'gh_stars',
      'gh_forks',
      'gh_issues'
    ]))


    return { ok: true, data: { history, since } }
  }
}

