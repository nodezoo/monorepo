
module.exports = function make_logout_user() {
  return async function logout_user(msg, meta) {
    const seneca = this


    const user_id = meta.custom?.principal?.user?.id

    if (null == user_id) {
      return {
        ok: false,
        why: 'unauthorized'
      }
    }


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

