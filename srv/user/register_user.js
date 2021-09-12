
module.exports = function make_register_user() {
  return async function register_user(msg) {
    const seneca = this


    const { email = null } = msg

    if ('string' !== typeof email) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['email'],
          why_exactly: 'required'
        }
      }
    }


    const { pass = null } = msg

    if ('string' !== typeof pass) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['pass'],
          why_exactly: 'required'
        }
      }
    }


    const { pass_confirm = null } = msg

    if ('string' !== typeof pass_confirm) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['pass_confirm'],
          why_exactly: 'required'
        }
      }
    }


    const signup = await seneca
      .post('register:user,sys:user', {
        user_data: {
          email,
          pass,
          repeat: pass_confirm
        }
      })


    if (!signup.ok) {
      return { ok: false }
    }


    return { ok: true }
  }
}

