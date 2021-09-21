const Shared = require('../../lib/shared')
const { pick } = Shared


module.exports = function make_is_premium() {
  return async function is_premium(msg, meta) {
    const seneca = this


    const user_id = meta.custom?.principal?.user?.id

    if (null == user_id) {
      return {
        ok: false,
        why: 'unauthorized'
      }
    }

    const premiummsg = { user_id }

    return seneca.post('role:user,is:premium', premiummsg)
  }
}

