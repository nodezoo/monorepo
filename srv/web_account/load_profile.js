const Shared = require('../../lib/shared')
const { pick } = Shared


module.exports = function make_load_profile() {
  return async function load_profile(msg, meta) {
    const seneca = this


    const user_id = meta.custom?.principal?.user?.id

    if (null == user_id) {
      return {
        ok: false,
        why: 'unauthorized'
      }
    }


    const profilemsg = { user_id }

    return seneca.post('role:user,load:profile', profilemsg)
  }
}

