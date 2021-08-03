
module.exports = function make_login_user() {
  return async function login_user(msg) {
    const seneca = this


    if ('string' !== typeof msg.email) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['email'],
          why_exactly: 'required'
        }
      }
    }

    const { email } = msg


    if ('string' !== typeof msg.pass) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['pass'],
          why_exactly: 'required'
        }
      }
    }

    const { pass } = msg


    // NOTE: We do not allow multiple logins per user. When a user with an
    // existing login tries to re-login, we log him out first, then log him
    // back in.
    //
    await seneca.post('logout:user,sys:user', { email })


    const auth = await seneca
      .post('login:user,sys:user', { email, pass })


    if (!auth.ok) {
      return { ok: false, why: 'unauthorized' }
    }


    const { login: { token: auth_token } } = auth 

    return {
      ok: true,
      data: { auth_token }
    }
  }
}

