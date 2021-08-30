const Express = require('express')
const Morgan = require('morgan')
const Path = require('path')


const vueApp = Express()


vueApp.use(Morgan('combined'))


const DIST_PATH = Path.join(__dirname, '..', 'dist')
vueApp.use(Express.static(DIST_PATH))


vueApp.get(/^\/account/, (req, res) => {
  const index = Path.join(DIST_PATH, 'account.html')
  return res.sendFile(index)
})


vueApp.get('/*', (req, res) => {
  const index = Path.join(DIST_PATH, 'index.html')
  return res.sendFile(index)
})


const server = vueApp.listen(8080, () => {
  const { port } = server.address()
  console.log('The frontend server is listening at port %s', port)
})

