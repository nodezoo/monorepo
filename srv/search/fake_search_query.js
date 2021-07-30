
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
        pkgs = []
      } else {
        /* TODO: Implement support for extended operators in all
         * seneca store plugins.
         */
        const matching_names = await seneca.make('nodezoo', 'npm')
          .list$({ fields$: ['name'], all$: true })
          .then(pkgs => pkgs.map(pkg => pkg.name))
          .then(pkgs_names => {
            return pkgs_names
              .filter(pkg_name => pkg_name.startsWith(prefix))
          })

        const matching_pkgs = matching_names.map(name =>
          seneca.make('nodezoo', 'npm').load$({ name }))

        pkgs = await Promise.all(matching_pkgs)
      }

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

