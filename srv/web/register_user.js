const Shared = require('../../lib/shared')
const { pick } = Shared


module.exports = function make_register_user() {
  return async function register_user(msg) {
    const seneca = this
    const registermsg = pick(msg, ['email', 'pass', 'pass_confirm'])

    return seneca.post('role:user,scope:auth,register:user', registermsg)
  }
}

