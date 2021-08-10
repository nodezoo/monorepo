const Express = require('express')
const { authenticate } = require('./middlewares/authenticate')
const Shared = require('../../../lib/shared')
const { pick } = Shared
const Patrun = require('patrun')


function makeApi({ seneca }) {
  const api = new Express.Router()


  api.use(Express.json())



  const public_actions = Patrun()
    .add({ role: 'web', scope: 'public', login: 'user' }, true)
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


  api.post('/account', authenticate({ seneca }), (req, res) => {
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
