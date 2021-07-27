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


  static make_seneca() {
    return Seneca({ log: 'test' })
      .use('promisify')
      .use('entity')
      .use('mem-store')
      .use('user')
  }
}


module.exports = TestHelpers
