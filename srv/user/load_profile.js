const Shared = require('../../lib/shared')
const { pick } = Shared


module.exports = function make_load_profile() {
  return async function load_profile(msg) {
    const seneca = this


    const { user_id } = msg

    if (null == user_id) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['user_id'],
          why_exactly: 'required'
        }
      }
    }


    const user_ent = await seneca.make('sys', 'user')
      .load$(user_id)

    if (!user_ent) {
      return { ok: false, why: 'not-found' }
    }


    const user = pick(user_ent, ['email'])

    return { ok: true, data: { user } }
  }
}

