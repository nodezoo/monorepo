const Shared = require('../../lib/shared')
const { pick } = Shared


module.exports = function make_login_user() {
  return async function login_user(msg) {
    const seneca = this
    const loginmsg = pick(msg, ['email', 'pass'])

    return seneca.post('role:user,scope:auth,login:user', loginmsg)
  }
}

