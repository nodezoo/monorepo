const Shared = require('../../lib/shared')
const { pick } = Shared


module.exports = function make_search_pkgs() {
  return async function search_pkgs(msg) {
    const seneca = this

    if ('string' !== typeof msg.prefix) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['prefix'],
          why_exactly: 'required'
        }
      }
    }

    const { prefix } = msg


    const searchmsg = { query: prefix }

    const out = await seneca
      .post('role:search,search:query', searchmsg)

    if (!out.ok) {
      //
      // TODO: Indicate the `why` to the client. Probably, do not just pass
      // out.why to the response. Instead, map internal why-codes
      // (aka error codes) to whatever client-facing ones you may define.
      //
      //
      return { ok: false }
    }

    const { data: { pkgs } } = out

    const pkgs_data = pkgs
      .map(pkg => pick(pkg, ['name', 'version', 'desc']))

    return { ok: true, data: { pkgs: pkgs_data } }
  }
}

