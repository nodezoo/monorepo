const Express = require('express')
const Path = require('path')


const vueApp = Express()


const ASSETS_PATH = Path.join(__dirname, 'assets')
vueApp.use('/assets', Express.static(ASSETS_PATH))


const VIEWS_PATH = Path.join(__dirname, '..', 'dist')
vueApp.use(Express.static(VIEWS_PATH))


vueApp.get('/*', (req, res) => {
  const index = Path.join(VIEWS_PATH, 'index.html')
  return res.sendFile(index)
})


vueApp.listen(8080)

