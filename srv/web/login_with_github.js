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


    const gh_emails_url = 'https://api.github.com/user/emails'

    const gh_emails_response = await Axios.get(gh_emails_url, {
      headers: {
        'accept': 'application/json',
        'authorization': `Bearer ${gh_access_token}`
      }
    })

    const gh_emails_infos = gh_emails_response.data

    const gh_primary_email_info = gh_emails_infos
      .find(gh_email => gh_email.primary)

    if (null == gh_primary_email_info) {
      /* NOTE: WARNING: This should not normally happen. Every
       * GitHub account should have a primary email.
       */
      return { ok: false, why: 'unauthorized' }
    }

    const { email: gh_email } = gh_primary_email_info


    const reg = await seneca.post('sys:user,register:user', {
      email: gh_email
    })

    if (!reg.ok) {
      const user_already_exists = 'handle-exists' === reg.why

      if (!user_already_exists) {
        console.error(reg)
        return { ok: false, why: 'unauthorized' }
      } else {
        /* NOTE: If the user with the given email already exists,
         * - sign in as usual.
         */
      }
    }


    const auth = await seneca.post('sys:user,login:user', {
      email: gh_email,
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

