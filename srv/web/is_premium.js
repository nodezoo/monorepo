const Shared = require('../../lib/shared')
const { pick } = Shared


module.exports = function make_is_premium() {
  return async function is_premium(msg) {
    const seneca = this
    const premiummsg = pick(msg, ['user_id'])

    return seneca.post('role:user,is:premium', premiummsg)
  }
}

