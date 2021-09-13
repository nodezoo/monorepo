const Express = require('express')
const Patrun = require('patrun')
const { authenticate } = require('./middlewares/authenticate')
const Shared = require('../../../lib/shared')
const { pick } = Shared
const makeStripeApi = require('./api-stripe.js')


function makeApi({ seneca }, options) {
  const api = new Express.Router()


  api.use('/stripe', makeStripeApi({ seneca }, options))


  api.post('/login-with-gh', Express.json(), (req, res, next) => {
    const { code } = req.body

    if (null == code) {
      return res.json({ ok: false, why: 'unauthorized' })
    }

    const loginmsg = { code }

    seneca.act('role:web,scope:public,login:with_github', loginmsg,
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


  api.post('/login', Express.json(), (req, res, next) => {
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
    .add({ role: 'web', scope: 'public', register: 'user' }, true)
    .add({ role: 'web', scope: 'public', search: 'pkgs' }, true)
    .add({ role: 'web', scope: 'public', show: 'pkg' }, true)
    .add({ role: 'web', scope: 'public', request: 'pass_reset' }, true)
    .add({ role: 'web', scope: 'public', reset: 'pass' }, true)


  api.post('/public', Express.json(), (req, res, next) => {
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
    .add({ role: 'web', scope: 'account', remove: 'bookmark' }, true)
    .add({ role: 'web', scope: 'account', load: 'profile' }, true)
    .add({ role: 'web', scope: 'account', is: 'premium' }, true)


  api.post('/account',
    Express.json(),

    authenticate({ seneca }),

    (req, res, next) => {
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
