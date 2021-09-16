const Express = require('express')
const Morgan = require('morgan')
const CookieParser = require('cookie-parser')
const Cors = require('cors')
const Shared = require('../../../lib/shared')
const { pick } = Shared
const { filter } = require('./middlewares/filter')


function make_api(args, options) {
  const api = new Express.Router()


   api.use(Cors({
     origin: 'http://localhost:8080', // TODO: Do not hardcode this.
     credentials: true,
     optionsSuccessStatus: 200
   }))


  api.use(Morgan('combined'))


  api.use(CookieParser())


  const { gateway_express_handler = null } = args

  if (null == gateway_express_handler) {
    throw new Error('The "gateway_express_handler" option is required')
  }


  api.post('/public',

    Express.json(),

    filter([
      { role: 'web', scope: 'public', register: 'user' },
      { role: 'web', scope: 'public', search: 'pkgs' },
      { role: 'web', scope: 'public', show: 'pkg' },
      { role: 'web', scope: 'public', request: 'pass_reset' },
      { role: 'web', scope: 'public', reset: 'pass' }
    ]),

    gateway_express_handler)


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
    console.error(err)


    const is_seneca_err = Boolean(err?.seneca$)

    if (is_seneca_err) {
      const not_found = ['act_not_found', 'not_allowed'].includes(err?.code$)

      if (not_found) {
        return res.sendStatus(404)
      }
    }


    return res.sendStatus(500)
  })


  return api
}


module.exports = { make_api }
