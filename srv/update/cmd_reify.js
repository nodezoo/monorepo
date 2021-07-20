
module.exports = function make_reify() {
  return async function reify(msg) {
    const seneca = this

    const pkgs = await seneca.make('nodezoo', 'orig')
      .list$({ fields$: ['name'] })

    const requests = pkgs.map(pkg =>
      seneca.post('role:info,need:part', { name: pkg.name }))

    await Promise.all(requests)

    return { ok: true }
  }
}

