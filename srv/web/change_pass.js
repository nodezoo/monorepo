
module.exports = function make_logout_user() {
  return async function logout_user(msg) {
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


    const out = await seneca.post('logout:user,sys:user', { user_id })

    if (!out.ok) {
      //
      // TODO: Indicate the `why` to the client. Probably, do not just pass
      // out.why to the response. Instead, map internal why-codes
      // (aka error codes) to whatever client-facing ones you may define.
      //
      //
      return { ok: false }
    }


    return { ok: true }
  }
}

