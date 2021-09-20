module.exports = function make_logout_user() {
  return async function logout_user(msg) {
    const seneca = this
    const user = seneca?.fixedmeta?.custom?.principal?.user

    if (null == user || null == user.id) {
      throw new Error('user')
    }

    const logoutmsg = { user_id: user.id }

    return seneca.post('role:user,scope:auth,logout:user', logoutmsg)
  }
}

