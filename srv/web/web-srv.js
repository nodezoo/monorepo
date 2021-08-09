const Express = require('express')
const Path = require('path')
const MakeServer = require('./server/server')


function web(options) {
  const seneca = this
  const app = MakeServer({ seneca }) 

  app.listen(9000)
}


module.exports = web
