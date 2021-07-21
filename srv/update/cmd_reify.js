
module.exports = function make_reify() {
  return async function reify(msg) {
    const seneca = this

    const pkgs = await seneca.make('nodezoo', 'orig')
      .list$({ reified_at: null, fields$: ['name'] })

    const requests = pkgs.map(async (pkg) => {
      const res = await seneca.post('role:info,need:part', {
        name: pkg.name
      })

      if (!res.ok) {
        /* NOTE: If the reification action for this particular package has
         * failed for some reason, we do not want to mark its corresponding
         * nodezoo/orig entity as "reified".
         */

        return
      }

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

