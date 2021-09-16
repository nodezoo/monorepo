const Shared = require('../../lib/shared')
const { pick } = Shared


module.exports = function make_remove_bookmark() {
  return async function remove_bookmark(msg) {
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


    const out = await seneca.post('role:user,scope:pkg,remove:bookmark', {
      user_id,
      name: pkg_name
    })


    //
    // TODO: Indicate the `why` to the client. Probably, do not just pass
    // out.why to the response. Instead, map internal why-codes
    // (aka error codes) to whatever client-facing ones you may define.
    //
    //

    return { ok: out.ok }
  }
}


