

module.exports = function make_list_pkg_history() {
  return async function list_pkg_history(msg) {
    const seneca = this


    // TODO: Respond with ok:false if the user is not a premium user.
    //

    console.dir(msg) // dbg

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

