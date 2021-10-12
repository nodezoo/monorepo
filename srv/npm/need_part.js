

module.exports = function make_need_part() {
  return async function need_part(msg) {
    const seneca = this
    const { name: pkg_name } = msg

    const res = await seneca.post(
      'role:source,source:npm,get:package',
      { name: pkg_name }
    )

    if (!res.ok) {
      console.error(res)
      return
    }

    await seneca.post('role:info,collect:part', {
      name: pkg_name,
      part: 'npm',
      data: res.pkg
    })

    return
  }
}

