const Express = require('express')
const { authenticate } = require('./middlewares/authenticate')
const Axios = require('axios')
const Shared = require('../../../lib/shared')
const { pick } = Shared
const Patrun = require('patrun')


function makeApi({ seneca }) {
  const api = new Express.Router()


  api.use(Express.json())


  api.post('/login-with-gh', (req, res, next) => {
    const { code } = req.body

    if (null == code) {
      return res.json({ ok: false, why: 'unauthorized' })
    }


    const {
      GITHUB_CLIENT_ID: client_id,
      GITHUB_CLIENT_SECRET: client_secret
    } = process.env


    Axios.post('https://github.com/login/oauth/access_token', {
      client_id,
      client_secret,
      code
    }, {
      headers: {
        'accept': 'application/json'
      }
    })
      .then(response => {
        const {
          access_token: gh_access_token,
          /*
          token_type: gh_token_type,
          scope: gh_scope
          */
        } = response.data


        console.dir('gh_access_token') // dbg
        console.dir(gh_access_token) // dbg


        return Axios.get('https://api.github.com/user', {
          headers: {
            'accept': 'application/json',
            'authorization': `Bearer ${gh_access_token}`
          }
        })
          .then(gh_user_response => {
            console.dir(gh_user_response.data) // dbg

            const { login: gh_login, id: gh_user_id } = gh_user_response.data
            const user_handle = gh_user_id.toString()

            console.dir('user_handle') // dbg
            console.dir(user_handle) // dbg

            /* @seneca/user truncates the user's handle to 15 characters,
             * which means we cannot use the user's GitHub "login" name,
             * and must rely on other means of identification instead,
             * such as the GitHub user id.
             */
            seneca.act('sys:user,register:user', {
              handle: user_handle,
              name: gh_login
            }, (err, reg) => {
              console.dir('reg') // dbg
              console.dir(reg) // dbg

              if (err) {
                console.error(err)
                return res.json({ ok: false, why: 'unauthorized' })
              }

              if (!reg.ok && 'handle-exists' !== reg.why) {
                console.error(reg)
                return res.json({ ok: false, why: 'unauthorized' })
              }

              seneca.act('sys:user,login:user', {
                handle: user_handle,
                auto: true
              }, (err, auth) => {
                if (err) {
                  console.error(err)
                  return res.json({ ok: false, why: 'unauthorized' })
                }

                if (!auth.ok) {
                  return res.json({ ok: false, why: 'unauthorized' })
                }

                const { login: { token: auth_token } } = auth

                // NOTE: WARNING: The httpOnly:true is very important to security.
                // If httpOnly:false, then the cookie will be accessible from the
                // frontend via `document.cookie`. This would allow for all sorts
                // of security issues. The httpOnly:true option prevents access
                // from the frontend code.
                //
                res.cookie('AUTH_TOKEN', auth_token, {
                  httpOnly: true
                })

                return res.json({ ok: true })
              })
            })
          })
      })
      .catch(err => {
        console.error(err)
        return res.json({ ok: false, why: 'unauthorized' })
      })
  })


  api.post('/login', (req, res, next) => {
    const { email = null, pass = null } = req.body

    if (null == email) {
      return res.json({ ok: false, why: 'unauthorized' })
    }

    if (null == pass) {
      return res.json({ ok: false, why: 'unauthorized' })
    }

    const loginmsg = { email, pass }

    seneca.act('role:web,scope:public,login:user', loginmsg,
      function (err, out) {
        if (err) {
          return next(err)
        }

        if (!out.ok) {
          return res.json({ ok: false, why: 'unauthorized' })
        }

        const { data: { auth_token } } = out


        // NOTE: WARNING: The httpOnly:true is very important to security.
        // If httpOnly:false, then the cookie will be accessible from the
        // frontend via `document.cookie`. This would allow for all sorts
        // of security issues. The httpOnly:true option prevents access
        // from the frontend code.
        //
        res.cookie('AUTH_TOKEN', auth_token, {
          httpOnly: true
        })

        return res.json({ ok: true })
      })
  })


  const public_actions = Patrun()
    .add({ role: 'web', scope: 'public', search: 'pkgs' }, true)
    .add({ role: 'web', scope: 'public', show: 'pkg' }, true)
    .add({ role: 'web', scope: 'public', request: 'pass_reset' }, true)
    .add({ role: 'web', scope: 'public', reset: 'pass' }, true)
  

  api.post('/public', (req, res, next) => {
    const { msg = null } = req.body

    if (null == msg) {
      return res.sendStatus(422)
    }

    const is_supported = public_actions.find(msg)

    if (!is_supported) {
      return res.sendStatus(404)
    }

    seneca.act(msg, (err, out) => {
      if (err) {
        return next(err)
      }

      if (!out) {
        return res.sendStatus(204)
      }

      return res.json(out)
    })

    return
  })



  const account_actions = Patrun()
    .add({ role: 'web', scope: 'account', logout: 'user' }, true)
    .add({ role: 'web', scope: 'account', list: 'pkg_history' }, true)
    .add({ role: 'web', scope: 'account', list: 'bookmarks' }, true)
    .add({ role: 'web', scope: 'account', bookmark: 'pkg' }, true)
    .add({ role: 'web', scope: 'account', load: 'profile' }, true)
    .add({ role: 'web', scope: 'account', is: 'premium' }, true)
    .add({
      role: 'web',
      scope: 'account',
      checkout_for: 'premium',
      submit: 'checkout'
    }, true)


  api.post('/account', authenticate({ seneca }), (req, res, next) => {
    const { msg = null } = req.body

    if (null == msg) {
      return res.sendStatus(422)
    }

    const is_supported = account_actions.find(msg)

    if (!is_supported) {
      return res.sendStatus(404)
    }


    const { user: { id: user_id } } = req.auth$

    seneca.act(msg, { user_id }, (err, out) => {
      if (err) {
        return next(err)
      }

      if (!out) {
        return res.sendStatus(204)
      }

      return res.json(out)
    })

    return
  })


  return api
}


module.exports = makeApi
