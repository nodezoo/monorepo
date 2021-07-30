const Express = require('express')
const Path = require('path')


//
// TODO: Remove this once Auth has been implemented.
//
const TEST_USER_AUTH_TOKEN = '2bfe7bbc-d6d0-4d3a-b694-579ff642ebb4'


function web(options) {
  const seneca = this


  /* TODO: Implement the hybrid approach to allow hot-reloading. See the
   * following links for more information:
   *
   *   https://stackoverflow.com/questions/33385288/do-i-need-webpack-dev-server-if-i-am-using-a-node-server-like-express
   *   https://stackoverflow.com/questions/26203725/how-to-allow-for-webpack-dev-server-to-allow-entry-points-from-react-router
   */

  const app = Express()


  app.use(Express.json())


  const VIEWS_PATH = Path.join(__dirname, 'www', 'dist')
  app.use(Express.static(VIEWS_PATH))


  app.get('/*', (req, res) => {
    const index = Path.join(VIEWS_PATH, 'index.html')
    return res.sendFile(index)
  })


  app.post('/seneca/pkgsWithNameStartingWith', (req, res, next) => {
    const { prefix = null } = req.body

    if ('string' !== typeof prefix) {
      return res.sendStatus(422)
    }

    const msg = {
      q: {
        name: { starts_with$: prefix }
      }
    }

    seneca.act('role:search,fake_search:query', msg, (err, out) => {
      if (err) {
        return next(err)
      }

      if (!out.ok) {
        return res.sendStatus(500)
      }

      const { data: { pkgs } } = out

      return res.json({ pkgs })
    })
  })


  app.post('/seneca/bookmarkPkg', (req, res, next) => {
    //
    // TODO: !!! AUTH !!!
    //

    const { name: pkg_name } = req.body

    if (null == pkg_name) {
      return res.sendStatus(422)
    }

    const msg = { auth_token: TEST_USER_AUTH_TOKEN, name: pkg_name }

    seneca.act('role:user,scope:pkg,add:bookmark', msg, function (err, out) {
      if (err) {
        return next(err)
      }

      if (!out.ok) {
        return res.sendStatus(500)
      }

      return res.sendStatus(201)
    })
  })


  app.use((err, req, res, next) => {
    console.error(err)
    return res.sendStatus(500)
  })


  app.listen(8080)
}


module.exports = web
