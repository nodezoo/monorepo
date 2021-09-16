const Shared = require('../../lib/shared')
const { pick } = Shared


module.exports = function make_show_pkg() {
  return async function show_pkg(msg) {
    const seneca = this


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


    const npm_ent = await seneca.make('nodezoo', 'npm')
      .load$({ name: pkg_name })

    if (!npm_ent) {
      return { ok: false, why: 'not-found' }
    }


    return {
      ok: true,
      data: {
        pkg: {
          name: npm_ent.name,
          npm: pick(npm_ent, ['name', 'version', 'giturl', 'desc', 'readme'])
          // TODO:
          // github: ...
        }
      }
    }
  }
}

