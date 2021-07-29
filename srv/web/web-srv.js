const Express = require('express')


function web(options) {
  const seneca = this
  const app = Express()


  app.get('/api/test', (req, res, next) => {
    seneca.act('role:info,test:true', function (err, out) {
      if (err) {
        return next(err)
      }

      return res.json(out)
    })
  })


  app.use((err, req, res, next) => {
    console.error(err)
    return res.sendStatus(500)
  })


  app.listen(8080)
}


module.exports = web
