
module.exports = function make_add_bookmark() {
  return async function add_bookmark(msg) {
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


    const { name: pkg_name } = msg

    if ('string' !== typeof pkg_name) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['name'],
          why_exactly: 'required'
        }
      }
    }


    /* BEGIN: checking that the package exists in our db
     */

    const npm_pkg = await seneca.make('nodezoo', 'npm')
      .load$({ name: pkg_name })

    if (!npm_pkg) {
      return {
        ok: false,
        why: 'not-found',
        details: { what: 'package' }
      }
    }

    /* END: checking that the package exists
     */


    /* BEGIN: make a bookmark
     */

    const { id: bookmark_id } = await seneca.make('nodezoo', 'bookmark')
      .data$({ name: pkg_name, owner_id: user_id })
      .save$({ upsert$: ['name', 'owner_id'] })

    /* END: make a bookmark
     */


    return { ok: true, data: { bookmark_id } }
  }
}

