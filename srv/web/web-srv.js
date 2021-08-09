const Express = require('express')
const Path = require('path')
const Morgan = require('morgan')
const Cors = require('cors')
const Shared = require('../../lib/shared')
const { pick } = Shared


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




  const app = Express()


  app.use(Express.json())


  app.use(Cors({
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200
  }))


  app.use(Morgan('combined'))


  app.post('/seneca/loginUser', (req, res, next) => {
    const { email, pass } = req.body

    if (null == email || null == pass) {
      return res.sendStatus(422)
    }
    
    const msg = { email, pass }

    seneca.act('role:user,scope:auth,login:user', msg, function (err, out) {
      if (err) {
        return next(err)
      }

      if (!out.ok) {
        return res.sendStatus(401)
      }

      const { data: { auth_token } } = out

      return res.json({ auth_token })
    })
  })


  app.post('/seneca/logoutUser', authenticate({ seneca }), (req, res, next) => {
    const { user: { id: user_id } } = req.auth$
    const msg = { user_id }

    seneca.act('logout:user,sys:user', msg, function (err, out) {
      if (err) {
        return next(err)
      }

      if (!out.ok) {
        return res.sendStatus(500)
      }

      return res.sendStatus(200)
    })
  })


  app.post(
    '/seneca/listPkgHistory',

    authenticate({ seneca }),

    premiumUsersOnly({ seneca }),

    (req, res, next) => {
      if ('string' !== typeof req.body.name) {
        return res.sendStatus(422)
      }

      const { name: pkg_name } = req.body


      if ('string' !== typeof req.body.since) {
        return res.sendStatus(422)
      }


      const is_valid_date_format = /^\d{4}-\d{2}-\d{2}$/.test(req.body.since)

      if (!is_valid_date_format) {
        return res.sendStatus(422)
      }


      const { since } = req.body


      const msg = { pkg_name, since }

      seneca.act('role:history,list:history', msg, (err, out) => {
        if (err) {
          return next(err)
        }

        if (!out.ok) {
          return res.sendStatus(500)
        }

        const { data: { history } } = out

        return res.json({ history })
      })
    })


  app.post('/seneca/listPkgsWithNamePrefix', (req, res, next) => {
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
      const pkgs_names = pkgs.map(pkg => pick(pkg, ['name']))

      return res.json({ pkgs: pkgs_names })
    })
  })


  app.post('/seneca/showPkg', (req, res, next) => {
    const { name: pkg_name } = req.body

    if (null == pkg_name) {
      return res.sendStatus(422)
    }

    const msg = { name: pkg_name }

    seneca.make('nodezoo', 'npm')
      .load$({ name: pkg_name }, function (err, pkg) {
        if (err) {
          return next(err)
        }

        return res.json({ pkg: pick(pkg, ['name']) })
      })
  })


  app.post('/seneca/doBookmarkPkg', authenticate({ seneca }), (req, res, next) => {
    const { user: { id: user_id } } = req.auth$


    const { name: pkg_name } = req.body

    if (null == pkg_name) {
      return res.sendStatus(422)
    }


    const msg = { user_id, name: pkg_name }

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


  app.post('/seneca/listMyBookmarkedPkgs', authenticate({ seneca }), (req, res, next) => {
    const { user: { id: user_id } } = req.auth$
    const msg = { user_id }

    seneca.act('role:user,scope:pkg,list:bookmarks', msg, function (err, out) {
      if (err) {
        return next(err)
      }

      const { bookmarks } = out.data

      // TODO: Fetch packages' data.
      //

      const pkgs_names = bookmarks.map(b => pick(b, ['name']))

      return res.json({ pkgs: pkgs_names })
    })
  })


  app.use((err, req, res, next) => {
    console.error(err)
    return res.sendStatus(500)
  })


  app.listen(9000)
}


// TODO: Move under middlewares/
//
function premiumUsersOnly({ seneca }) {
  return (req, res, next) => {
    if (null == req.auth$?.user?.id) {
      return res.sendStatus(401)
    }

    const { user: { id: user_id } } = req.auth$
    const msg = { user_id }

    seneca.act('role:user,is:premium', msg, (err, out) => {
      if (err) {
        return next(err)
      }

      if (!out.ok) {
        return res.sendStatus(500)
      }

      const { data: { is_premium } } = out

      if (!is_premium) {
        return res.sendStatus(402)
      }

      return next()
    })
  }
}


// TODO: Move under middlewares/
//
function authenticate({ seneca }) {
  return (req, res, next) => {
    const authorization = req.get('authorization')


    if ('string' !== typeof authorization) {
      return res.sendStatus(401)
    }


    if (!authorization.match(/^Bearer \S+/)) {
      return res.sendStatus(401)
    }


    const token = authorization.replace('Bearer ', '')
    const msg = { token }


    // TODO: Do not call @seneca/user directly !!!
    //
    seneca.act('auth:user,sys:user', msg, function (err, out) {
      if (err) {
        return next(err)
      }

      if (!out.ok) {
        console.error(out)
        return res.sendStatus(401)
      }


      const { user } = out
      req.auth$ = { user: pick(user, ['id']) }


      return next()
    })
  }
}


module.exports = web
