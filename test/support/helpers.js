const Assert = require('assert')
const Seneca = require('seneca')


class TestHelpers {
  static async register_user(args, ctx) {
    Assert(args, 'args')

    Assert(ctx, 'ctx')
    Assert(ctx.seneca, 'ctx.seneca')

    const { seneca } = ctx

    const auth = await seneca.post('register:user,sys:user', args)

    if (!auth.ok) {
      throw new Error(auth.why)
    }

    const { user } = auth

    Assert(user, 'user')

    return user
  }


  static async login_user(args, ctx) {
    Assert(args, 'args')

    Assert(ctx, 'ctx')
    Assert(ctx.seneca, 'ctx.seneca')

    const { seneca } = ctx

    const auth = await seneca.post('login:user,sys:user', args)

    if (!auth.ok) {
      throw new Error(auth.why)
    }

    const { user, login } = auth

    Assert(user, 'user')
    Assert(login, 'login')

    return { user, login }
  }


  static register_and_login_user(args, ctx) {
    Assert(args, 'args')
    Assert.strictEqual(typeof args.email, 'string', 'args.email')
    Assert.strictEqual(typeof args.pass, 'string', 'args.pass')

    const { email, pass } = args


    Assert(ctx, 'ctx')
    Assert(ctx.seneca, 'ctx.seneca')

    const { seneca } = ctx


    await register_user({ email, pass }, { seneca })

    const {
      login: { token: auth_token },
      user
    } = await login_user({ email, pass }, { seneca })

    Assert(auth_token, 'auth_token')
    Assert(user, 'user')

    return { auth_token, user }
  }


  static make_seneca() {
    return Seneca({ log: 'test' })
      .use('promisify')
      .use('entity')
      .use('mem-store')
      .use('user')
  }
}


module.exports = TestHelpers
