module.exports = function make_logout_user() {
  return async function logout_user(msg, meta) {
    const seneca = this

    const user_id = meta.custom?.principal?.user?.id

    if (null == user_id) {
      return {
        ok: false,
        why: 'unauthorized'
      }
    }

    const logoutmsg = { user_id }

    return seneca.post('role:user,scope:auth,logout:user', logoutmsg)
  }
}

