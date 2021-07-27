const Auth = require('./lib/auth')


module.exports = function make_list_bookmarks() {
  return async function list_bookmarks(msg) {
    const seneca = this


    const auth = await Auth.user(msg, { seneca })

    if (!auth) {
      return { ok: false, why: 'unauthorized' }
    }

    const { user } = auth
    const { id: user_id } = user


    const user_bookmarks = await seneca.make('nodezoo', 'bookmark')
      .list$({ owner_id: user_id })


    return {
      ok: true,
      data: {
        bookmarks: user_bookmarks.map(b => ({
          id: b.id,
          name: b.name,
          owner_id: b.owner_id
        }))
      }
    }
  }
}

