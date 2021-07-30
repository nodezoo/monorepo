
module.exports = function make_bookmark_pkg() {
  return async function bookmark_pkg(msg) {
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


    /* BEGIN: checking that the package exists in our db
     */

    if ('string' !== typeof msg.name) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['name'],
          why_exactly: 'required'
        }
      }
    }

    const { name: pkg_name } = msg


    const npm_pkg = await seneca.make('nodezoo', 'npm')
      .load$({ name: pkg_name })

    if (!npm_pkg) {
      return {
        ok: false,
        why: 'not_found',
        details: { what: 'package' }
      }
    }

    /* END: checking that the package exists
     */


    /* BEGIN: make a bookmark
     */

    await seneca.make('nodezoo', 'bookmark')
      .data$({ name: pkg_name, owner_id: user_id })
      .save$({ upsert$: ['name', 'owner_id'] })

    /* END: make a bookmark
     */


    return { ok: true }
  }
}

