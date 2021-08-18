const Shared = require('../../lib/shared')
const { pick } = Shared


module.exports = function make_load_profile() {
  return async function load_profile(msg) {
    const seneca = this
    const profilemsg = pick(msg, ['user_id'])

    return seneca.post('role:user,load:profile', profilemsg)
  }
}

