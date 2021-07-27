
class Auth {
  static async user(msg, { seneca }) {
    if ('string' !== typeof msg.auth_token) {
      return null
    }

    const { auth_token } = msg

    const auth = await seneca.post('auth:user,sys:user', {
      token: auth_token
    })

    if (!auth.ok) {
      return null
    }

    return auth
  }
}

module.exports = Auth
