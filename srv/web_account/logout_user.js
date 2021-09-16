const Shared = require('../../lib/shared')
const { pick } = Shared


module.exports = function make_logout_user() {
  return async function logout_user(msg) {
    const seneca = this
    const logoutmsg = pick(msg, ['user_id'])

    return seneca.post('role:user,scope:auth,logout:user', logoutmsg)
  }
}

