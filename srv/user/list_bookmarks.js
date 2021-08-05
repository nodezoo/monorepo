const Shared = require('../../lib/shared')
const { pick } = Shared


module.exports = function make_list_bookmarks() {
  return async function list_bookmarks(msg) {
    const seneca = this


    const { user_id } = msg

    if (null == user_id) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['user_id'],
          why_exactly: 'required'
        }
      }
    }


    const user_bookmarks = await seneca.make('nodezoo', 'bookmark')
      .list$({ owner_id: user_id })


    return {
      ok: true,
      data: {
        bookmarks: user_bookmarks.map(b =>
          pick(b, ['id', 'name', 'owner_id']))
      }
    }
  }
}

