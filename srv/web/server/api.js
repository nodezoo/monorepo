const Express = require('express')
const { authenticate } = require('./middlewares/authenticate')


function makeApi({ seneca }) {
  const api = new Express.Router()


  api.use(Express.json())


  api.post('/public', (req, res) => {
    return res.sendStatus(501)
  })


  api.post('/account', authenticate({ seneca }), (req, res) => {
    return res.sendStatus(501)
  })


  return api
}

