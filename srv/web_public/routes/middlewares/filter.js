const Patrun = require('patrun')


function filter(whitelist) {
  const allowed = whitelist
    .reduce((acc, msg) => acc.add(msg, true), Patrun())

  return (req, res, next) => {
    const msg = req.body
    const is_allowed = allowed.find(msg)

    if (is_allowed) {
      return next()
    }

    return res.sendStatus(404)
  }
}


module.exports = { filter }
