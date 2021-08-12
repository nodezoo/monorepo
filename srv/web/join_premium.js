const Shared = require('../../lib/shared')
const { pick } = Shared


module.exports = function make_join_premium() {
  return async function join_premium(msg) {
    const seneca = this
    const joinmsg = pick(msg, ['user_id'])

    const out = await seneca.post('role:user,join:premium', joinmsg)

    return { ok: out.ok }
  }
}

