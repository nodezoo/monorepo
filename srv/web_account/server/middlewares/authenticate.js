const Shared = require('../../../../lib/shared')
const { pick } = Shared


function authenticate({ seneca }) {
  return (req, res, next) => {
    const token = req.cookies.AUTH_TOKEN
    const msg = { token }


    // TODO: QUESTION: Perhaps, we shouldn't call the @seneca/user
    // plugin's API directly?
    //
    seneca.act('auth:user,sys:user', msg, function (err, out) {
      if (err) {
        return next(err)
      }

      if (!out.ok) {
        console.error(out)
        return res.sendStatus(401)
      }


      const { user } = out
      req.auth$ = { user: pick(user, ['id']) }


      return next()
    })
  }
}


module.exports = { authenticate }
