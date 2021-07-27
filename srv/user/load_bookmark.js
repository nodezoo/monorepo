const Auth = require('./lib/auth')


module.exports = function make_load_bookmarks() {
  return async function load_bookmarks(msg) {
    const seneca = this


    const auth = await Auth.user(msg, { seneca })

    if (!auth) {
      return { ok: false, why: 'unauthorized' }
    }

    const { user } = auth
    const { id: user_id } = user


    if ('string' !== typeof msg.id) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['id'],
          why_exactly: 'required'
        }
      }
    }

    const { id: bookmark_id } = msg


    const bookmark = await seneca.make('nodezoo', 'bookmark')
      .load$({ owner_id: user_id, id: bookmark_id })


    if (!bookmark) {
      return { ok: false, why: 'not-found' }
    }


    return {
      ok: true,
      data: {
        bookmark: bookmark.data$(false)
      }
    }
  }
}

