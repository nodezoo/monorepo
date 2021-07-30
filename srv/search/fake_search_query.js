
module.exports = function make_fake_search_query() {
  return async function fake_search_query(msg) {
    const seneca = this


    const q = msg.q || {}


    const is_prefix_search = q.name &&
      'string' === typeof q.name.starts_with$

    if (is_prefix_search) {
      const prefix = q.name.starts_with$
      const is_empty_prefix = '' === prefix.trim()


      let pkgs

      if (is_empty_prefix) {
        return {
          ok: true,
          data: { pkgs: [] }
        }
      }

      /* TODO: Implement support for extended operators in all
       * seneca store plugins, and then use seneca-entity as
       * opposed to the native SQL driver.
       */

      const db = await seneca.make('nodezoo', 'npm').native$()

      return new Promise((resolve, reject) => {
        const sql = `select * from nodezoo_npm where name like ? limit 10`
        const startswith = s => s + '%'

        return db.all(sql, [startswith(prefix)], (err, pkgs) => {
          if (err) {
            return reject(err)
          }

          return resolve({
            ok: true,
            data: { pkgs }
          })
        })
      })
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

