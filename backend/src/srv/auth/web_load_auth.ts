
module.exports = function make_web_load_user() {
  return async function web_load_user(this: any, msg: any, meta: any) {
    const seneca = this
    const user = meta.custom.principal?.user

    let out: any = {
      ok: true,
      section: 'auth.state',
      content: 'signedout',
    }

    if (user) {

      // TODO: double work? user already loaded by gateway
      let res = await this.post('aim:auth,load:auth', {
        user_id: user.id
      })

      if (!res.ok) {
        return res
      }

      out.content = res.state

      out.user = {
        id: user.id,
        email: user.email,
        handle: user.handle,
      }

      out.foo = 1

      out.handler = 'load_auth'
    }

    return out
  }
}
