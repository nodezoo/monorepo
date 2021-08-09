const Express = require('express')
const Path = require('path')
const MakeServer = require('./server/server')


function web(options) {
  const seneca = this



  const vue_app = Express()


  const ASSETS_PATH = Path.join(__dirname, 'www', 'src', 'assets')
  vue_app.use('/assets', Express.static(ASSETS_PATH))


  const VIEWS_PATH = Path.join(__dirname, 'www', 'dist')
  vue_app.use(Express.static(VIEWS_PATH))


  vue_app.get('/*', (req, res) => {
    const index = Path.join(VIEWS_PATH, 'index.html')
    return res.sendFile(index)
  })


  vue_app.listen(8080)




  const app = MakeServer({ seneca: this })


  app.listen(9000)
}


module.exports = web
