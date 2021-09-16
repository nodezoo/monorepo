const { isPremiumUser } = require('./lib/shared')


module.exports = function make_list_pkg_history() {
  return async function list_pkg_history(msg) {
    const seneca = this


    if (null == typeof msg.user_id) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['user_id'],
          why_exactly: 'required'
        }
      }
    }

    const { user_id } = msg


    if ('string' !== typeof msg.name) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['name'],
          why_exactly: 'required'
        }
      }
    }

    const { name: pkg_name } = msg


    if ('string' !== typeof msg.since) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['since'],
          why_exactly: 'required'
        }
      }
    }

    const is_valid_date_format = /^\d{4}-\d{2}-\d{2}$/.test(msg.since)

    if ('string' !== typeof msg.since) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['since'],
          why_exactly: 'format'
        }
      }
    }

    const { since } = msg


    const is_premium = await isPremiumUser({ user_id }, { seneca })

    if (!is_premium) {
      return { ok: false, why: 'payment-required' }
    }


    const out = await seneca.post('role:history,list:history', {
      pkg_name,
      since
    })

    if (!out.ok) {
      //
      // TODO: Indicate the `why` to the client. Probably, do not just pass
      // out.why to the response. Instead, map internal why-codes
      // (aka error codes) to whatever client-facing ones you may define.
      //
      //
      return { ok: false }
    }

    const { data: { history } } = out

    return { ok: true, data: { history } }
  }
}

