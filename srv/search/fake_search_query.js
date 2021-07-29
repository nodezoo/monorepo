
module.exports = function make_fake_search_query() {
  return async function fake_search_query(msg) {
    const seneca = this


    const pkgs = await seneca.make('nodezoo', 'npm')
      .list$(safe_query(msg))


    return {
      ok: true,
      data: { pkgs }
    }
  }
}


function safe_query(msg) {
  const out = {}


  const q = msg.q || {}


  out.limit$ = 'number' === typeof q.limit$
    ? q.limit$
    : 10


  if ('string' === typeof q.name) {
    out.name = q.name
  }


  return out 
}

