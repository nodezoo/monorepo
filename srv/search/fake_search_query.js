const { pick } = require('../../lib/shared')


module.exports = function make_fake_search_query() {
  return async function fake_search_query(msg) {
    const seneca = this


    const q = msg.q || {}

    const is_prefix_search = q.name &&
      'string' === typeof q.name.starts_with$


    if (is_prefix_search) {
      const prefix = q.name.starts_with$
      const is_empty_prefix = '' === prefix.trim()


      if (is_empty_prefix) {
        return {
          ok: true,
          data: { pkgs: [] }
        }
      }


      const ents = await seneca.make('nodezoo', 'npm')
        .list$({
          limit$: 10,
          name: {
            startswith$: prefix
          }
        })


      const pkgs = ents.map(ent => pick(ent, [
        'name',
        'version',
        'giturl',
        'desc',
        'readme'
      ]))
      

      return {
        ok: true,
        data: { pkgs }
      }
    }

    return {
      ok: false,
      why: 'not-impl',
      details: {
        message: 'Sorry, only searching by the prefix of a package' +
          ' name is currently supported'
      }
    }
  }
}

