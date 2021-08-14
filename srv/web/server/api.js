const Express = require('express')
const { authenticate } = require('./middlewares/authenticate')
const Shared = require('../../../lib/shared')
const { pick } = Shared
const Patrun = require('patrun')


function makeApi({ seneca }) {
  const api = new Express.Router()


  api.use(Express.json())


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
    .add({ role: 'web', scope: 'account', join: 'premium' }, true)
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
