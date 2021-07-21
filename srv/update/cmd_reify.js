
module.exports = function make_reify() {
  return async function reify(msg) {
    const seneca = this

    const pkgs = await seneca.make('nodezoo', 'orig')
      .list$({ reified_at: null, fields$: ['name'] })

    const requests = pkgs.map(async (pkg) => {
      await seneca.post('role:info,need:part', { name: pkg.name })

      await pkg
        .data$({
          reified_at: new Date().toISOString()
        })
        .save$()
    })

    await Promise.all(requests)

    return { ok: true }
  }
}

