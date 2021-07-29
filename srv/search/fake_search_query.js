
module.exports = function make_fake_search_query() {
  return async function fake_search_query(msg) {
    const seneca = this


    const q = msg.q || {}
    const safe_query = {}

    safe_query.limit$ = 'number' === q.limit$ ? q.limit$ : 5 
    if ('string' === typeof q.name) safe_query.name = q.name


    let pkgs

    pkgs = await seneca.make('nodezoo', 'npm')
      .list$(safe_query)


    const is_prefix_search = safe_query.name &&
      'string' === typeof q.name.starts_with$

    if (is_prefix_search) {
      pkgs = pkgs.filter(pkg => pkg.name.startsWith(q.name.starts_with$))
    }


    return {
      ok: true,
      data: { pkgs }
    }
  }
}

