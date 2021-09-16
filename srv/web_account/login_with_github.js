const Axios = require('axios')
const Shared = require('../../lib/shared')
const { pick } = Shared


module.exports = function make_login_with_github(options_wrapper) {
  const { options } = options_wrapper

  const {
    github_client_id,
    github_client_secret,
    github_url,
    github_api_url
  } = options


  if (null == github_client_id) {
    throw new Error('missing github_client_id option')
  }

  if (null == github_client_secret) {
    throw new Error('missing github_client_secret option')
  }

  if (null == github_url) {
    throw new Error('missing github_url option')
  }

  if (null == github_api_url) {
    throw new Error('missing github_api_url option')
  }


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


    const login_url = github_url + '/login/oauth/access_token'

    const login_response = await Axios.post(login_url, {
      client_id: github_client_id,
      client_secret: github_client_secret,
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


    const gh_emails_url = github_api_url + '/user/emails'

    // TODO: Use Octokit here?
    //
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
      const already_exists = 'string' === typeof reg.why
        && reg.why.endsWith('-exists')

      if (!already_exists) {
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

