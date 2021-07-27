
module.exports = function make_list_bookmarks() {
  return async function list_bookmarks(msg) {
    const seneca = this


    /* BEGIN: auth
     */

    if ('string' !== typeof msg.auth_token) {
      return { ok: false, why: 'unauthorized' }
    }

    const { auth_token } = msg

    const auth = await seneca.post('auth:user,sys:user', {
      token: auth_token
    })

    if (!auth.ok) {
      return { ok: false, why: 'unauthorized' }
    }

    const { user } = auth
    const { id: user_id } = user

    /* END: auth
     */


    const user_bookmarks = await seneca.make('nodezoo', 'bookmark')
      .list$({ owner_id: user_id })


    return {
      ok: true,
      data: {
        bookmarks: user_bookmarks.map(b => {
          return { name: b.name }
        })
      }
    }
  }
}

