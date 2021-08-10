

function authenticate({ seneca }) {
  return (req, res, next) => {
    const authorization = req.get('authorization')


    if ('string' !== typeof authorization) {
      return res.sendStatus(401)
    }


    if (!authorization.match(/^Bearer \S+/)) {
      return res.sendStatus(401)
    }


    const token = authorization.replace('Bearer ', '')
    const msg = { token }


    // TODO: Do not call @seneca/user directly !!!
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
