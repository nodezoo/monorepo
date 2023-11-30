
const Express = require('express')
const CookieParser = require('cookie-parser')

const Seneca = require('seneca')
const { Local, /* Concern */ } = require('@voxgig/system')

import Pkg from '../../../package.json'
import Model from '../../../model/model.json'

const NODE_ENV = process.env.NODE_ENV || 'development'
const STAGE = process.env.NODEZOO_STAGE || 'local'


run({
  version: Pkg.version
})


async function run(info: any) {
  let seneca = await runSeneca(info)
  let app = await runExpress(info, seneca)

  console.log('STARTED', info)
}


async function runSeneca(info: any) {

  const { deep } = Seneca.util

  const gateway_auth = {
    spec: {
      express_cookie: { token: { name: 'nodezoo-auth' } },
    }
  }

  const seneca = Seneca({
    tag: 'local',
    legacy: false,
    log: {
      logger: 'flat',
      level: 'warn'
    },
  })

  seneca.context.model = Model
  seneca.context.env = 'local'
  seneca.context.stage = STAGE
  seneca.context.srvname = 'all'

  info.seneca = seneca.id

  seneca
    .test()
    .use('promisify')
    .use('entity')

    // NOTE: load after store plugins
    .use('entity-util', {
      when: {
        active: true
      }
    })

    .use('user')
    .use('reload')
    .use('repl')


    .use('gateway$public', {
      allow: {
        'aim:web,on:auth': true,
        'handle:hook': true
      }
    })
    .use('gateway$private', {
      // allow: Object.keys(Model.main.srv)
      //   .reduce(((a,n)=>(a['aim:web,on:'+n]=true,a)),{})
    })
    .use('gateway-express$public', {
      auth: { token: { name: 'nodezoo-auth' } },
    })
    .use('gateway-express$private', {
      auth: { token: { name: 'nodezoo-auth' } },
    })
    .use('gateway-auth$public', deep({
      spec: {
        express_cookie: {
          active: true,
          user: { auth: true, require: false },
        }
      }
    }, gateway_auth))
    .use('gateway-auth$private', deep({
      spec: {
        express_cookie: {
          active: true,
          user: { auth: true, require: true },
        }
      }
    }, gateway_auth))

    .message('handle:hook', async function(msg: any) {
      console.log('HANDLE-HOOK', msg)
      return { ok: true }
    })




  seneca

    // .use(Concern, {
    //   folder: __dirname + '/../../../dist/concern'
    // })

    .use(function setup_data(this: any) {
      this.prepare(async function(this: any) {
        this
          .act('role:mem-store,cmd:import', {
            merge: true,
            json: JSON.stringify(require(__dirname + '/data.js'))
          })
      })
    })

    .use(Local, {
      srv: {
        folder: __dirname + '/../../../dist/srv'
      },
      options: {
      }
    })

  await seneca.ready()

  return seneca
}


async function runExpress(info: any, seneca: any) {
  const app = Express()

  app
    .use(Express.json())
    .use(new CookieParser())
    .post('/api/web/public/:end', seneca.export('gateway-express$public/handler'))
    .post('/api/web/private/:end', seneca.export('gateway-express$private/handler'))
    .get('/api/web/public/hook/:name/:code', seneca.export('gateway-express$public/hook'))
    .get('/api/web/public/hook/:name', seneca.export('gateway-express$public/hook'))
    .use(Express.static('./static'))
    .listen(8888)

  return app
}
