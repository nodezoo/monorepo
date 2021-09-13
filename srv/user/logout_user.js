
module.exports = function make_logout_user() {
  return async function logout_user(msg) {
    const seneca = this


    const { user_id = null } = msg

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


    const logout = await seneca
      .post('logout:user,sys:user', { user_id })

    if (!logout.ok) {
      return { ok: false }
    }


    return { ok: true }
  }
}

