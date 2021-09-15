const Seneca = require('seneca')
const Express = require('express')
const Shared = require('../../../lib/shared')
const { pick } = Shared
const makeStripeApi = require('./api-stripe.js')


async function makeApi({ seneca }, options) {
  const public_seneca = Seneca({ legacy: false })
    .use('promisify')
    .use('gateway')
    .use('gateway-express')

    .use('allow', {
      check: [
        'role:web,scope:public,register:user',
        'role:web,scope:public,search:pkgs',
        'role:web,scope:public,show:pkg',
        'role:web,scope:public,request:pass_reset',
        'role:web,scope:public,reset:pass'
      ],
      wrap: [
        'role:*'
      ]
    })

    .add('role:web', function (msg, reply, _meta) {
      return seneca.root.act(msg, reply)
    })

  await public_seneca.ready()


  const account_seneca = Seneca({ legacy: false })
    .use('promisify')

    .use('gateway')
    .use('gateway-express')

    .use('gateway-express-auth', {
      cookie: {
        name: 'AUTH_TOKEN'
      },

      seneca_auth: () => seneca
    })

    .use('allow', {
      check: [
        'role:web,scope:account,logout:user',
        'role:web,scope:account,list:pkg_history',
        'role:web,scope:account,list:bookmarks',
        'role:web,scope:account,bookmark:pkg',
        'role:web,scope:account,remove:bookmark',
        'role:web,scope:account,load:profile',
        'role:web,scope:account,is:premium'
      ],
      wrap: [
        'role:*'
      ]
    })

    .add('role:web', function (msg, reply, meta) {
      const user_id = meta?.custom?.principal?.user?.id
      return seneca.root.act({ ...msg, user_id }, reply)
    })

  await account_seneca.ready()


  const api = new Express.Router()


  api.post('/public',
    Express.json(),
    public_seneca.export('gateway-express/handler'))


  api.post('/account',
    Express.json(),
    account_seneca.export('gateway-express/handler'))


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


  api.use((err, req, res, next) => {
    if (err?.seneca$ && 'not_allowed' === err?.code$) {
      return res.sendStatus(404)
    }

    return next(err)
  })


  return api
}


module.exports = makeApi
