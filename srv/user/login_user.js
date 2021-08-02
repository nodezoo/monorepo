
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


    const auth = await helpLogin({ email, pass }, { seneca })

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


async function helpLogin(args, ctx) {
  const { email, pass } = args
  const { seneca } = ctx


  const already_authed = await seneca
    .post('auth:user,sys:user', { email })

  if (already_authed.ok) {
    return already_authed
  }


  return seneca
    .post('login:user,sys:user', { email, pass })
}

