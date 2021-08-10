
module.exports = function make_login_user() {
  return async function login_user(msg) {
    const seneca = this
    return seneca.post('role:user,scope:auth,login:user', msg)
  }
}

