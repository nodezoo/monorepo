const Express = require('express')
const Morgan = require('morgan')
const Cors = require('cors')
const Shared = require('../../../lib/shared')
const { authenticate } = require('./middlewares/authenticate')
const { premiumUsersOnly } = require('./middlewares/premium_users_only')
const { pick } = Shared



function makeServer({ seneca }) {
  const app = Express()


  app.use(Express.json())


  app.use(Cors({
    origin: 'http://localhost:8080', // TODO: Do not hardcode this.
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


  return app
}


module.exports = makeServer
