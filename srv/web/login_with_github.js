const Axios = require('axios')
const Shared = require('../../lib/shared')
const { pick } = Shared


module.exports = function make_login_with_github() {
  return async function login_with_github(msg) {
    const seneca = this


    const { code } = msg

    if (null == code) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['code'],
          why_exactly: 'required'
        }
      }
    }


    const {
      GITHUB_CLIENT_ID: client_id,
      GITHUB_CLIENT_SECRET: client_secret
    } = process.env


    const login_url = 'https://github.com/login/oauth/access_token'

    const login_response = await Axios.post(login_url, {
      client_id,
      client_secret,
      code
    }, {
      headers: {
        'accept': 'application/json'
      }
    })


    const {
      access_token: gh_access_token,
      /*
      token_type: gh_token_type,
      scope: gh_scope
      */
    } = login_response.data


    const gh_user_url = 'https://api.github.com/user'

    const gh_user_response = await Axios.get(gh_user_url, {
      headers: {
        'accept': 'application/json',
        'authorization': `Bearer ${gh_access_token}`
      }
    })

    const {
      login: gh_login,
      id: gh_user_id
    } = gh_user_response.data


    const user_handle = `${gh_user_id}`

    /* @seneca/user truncates the user's handle to 15 characters,
     * which means we cannot use the user's GitHub "login" name,
     * and must rely on other means of identification instead,
     * such as the GitHub user id.
     */
    const reg = await seneca.post('sys:user,register:user', {
      handle: user_handle,
      name: gh_login
    })

    if (!reg.ok && 'handle-exists' !== reg.why) {
      console.error(reg)
      return { ok: false, why: 'unauthorized' }
    }


    const auth = await seneca.post('sys:user,login:user', {
      handle: user_handle,
      auto: true
    })

    if (!auth.ok) {
      console.error(auth)
      return { ok: false, why: 'unauthorized' }
    }


    const { login: { token: auth_token } } = auth


    return { ok: true, data: { auth_token } }
  }
}

