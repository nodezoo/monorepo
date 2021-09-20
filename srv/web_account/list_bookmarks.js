const Shared = require('../../lib/shared')
const { pick } = Shared


module.exports = function make_list_bookmarks() {
  return async function list_bookmarks(msg) {
    const seneca = this


    if (null == msg.user_id) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['user_id'],
          why_exactly: 'required'
        }
      }
    }

    const { user_id } = msg


    const out = await seneca.post('role:user,scope:pkg,list:bookmarks', {
      user_id
    })


    if (!out.ok) {
      //
      // TODO: Indicate the `why` to the client. Probably, do not just pass
      // out.why to the response. Instead, map internal why-codes
      // (aka error codes) to whatever client-facing ones you may define.
      //
      //
      return { ok: false }
    }

    const { bookmarks } = out.data

    // TODO: Fetch packages' data.
    //

    const pkgs_names = bookmarks.map(b => b.name)

    const pkgs = await seneca.make('nodezoo', 'npm')
      .list$({ name: pkgs_names })

    const pkgs_data = pkgs
      .map(pkg => pick(pkg, ['name', 'version', 'desc']))

    return { ok: true, pkgs: pkgs_data }
  }
}

