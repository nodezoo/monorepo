const Express = require('express')
const Path = require('path')


const app = Express()


app.use(Express.json())


const VIEWS_PATH = Path.join(__dirname, '..', './dist/')
app.use(Express.static(VIEWS_PATH))


app.get('/*', (req, res) => {
  const index = Path.join(VIEWS_PATH, 'index.html')
  return res.sendFile(index)
})


app.listen(process.env.PORT || 9000)
