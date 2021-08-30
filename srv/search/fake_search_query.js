const { pick } = require('../../lib/shared')


module.exports = function make_fake_search_query() {
  return async function fake_search_query(msg) {
    const seneca = this


    const { query = null } = msg

    if ('string' !== typeof query) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['query'],
          why_exactly: 'required'
        }
      }
    }

    if ('' === query.trim()) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['query'],
          why_exactly: 'blank'
        }
      }
    }


    const search = await seneca
      .post('sys:search,cmd:search', { query })


    if (!search.ok) {
      return search
    }

    const { hits } = search.data

    const pkgs = hits.map(hit => pick(hit.doc, [
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
}

