

module.exports = function make_need_part() {
  return async function need_part(msg) {
    const seneca = this
    const { name: pkg_name } = msg

    const start = Date.now()
    console.log('BEGIN', pkg_name, start) // dbg

    const res = await seneca.post(
      'role:source,source:npm,get:package',
      { name: pkg_name }
    )

    if (res.ok) {
      await seneca.post('role:info,collect:part', {
        name: pkg_name,
        part: 'npm',
        data: res.pkg
      })

      return
    }

    const end = Date.now()
    console.log('END', name, end, end - start) // dbg

    return
  }
}
