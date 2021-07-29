const Express = require('express')


function web(options) {
  const seneca = this
  const app = Express()


  app.use(Express.json())


  app.get('/api/pkgs', (req, res, next) => {
    seneca.act('role:search,fake_search:query', req.body, function (err, out) {
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
