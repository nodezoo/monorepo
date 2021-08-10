

function premiumUsersOnly({ seneca }) {
  return (req, res, next) => {
    if (null == req.auth$?.user?.id) {
      return res.sendStatus(401)
    }

    const { user: { id: user_id } } = req.auth$
    const msg = { user_id }

    seneca.act('role:user,is:premium', msg, (err, out) => {
      if (err) {
        return next(err)
      }

      if (!out.ok) {
        return res.sendStatus(500)
      }

      const { data: { is_premium } } = out

      if (!is_premium) {
        return res.sendStatus(402)
      }

      return next()
    })
  }
}


module.exports = { premiumUsersOnly }
