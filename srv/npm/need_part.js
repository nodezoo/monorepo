const Assert = require('assert')


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
      Assert.fail('get:package')
      return
    }

    await seneca.post('role:info,collect:part', {
      name: pkg_name,
      part: 'npm',
      data: res.pkg
    })


    // NOTE: Because the package may already be in the search pool,
    // we should then overwrite it in the search pool.
    //
    // sys:search,cmd:remove is required to not crash by its
    // contract, so it should be perfectly fine to try to
    // remove a document from the search pool that does not
    // exist.

    Assert(null != res.pkg, 'res.pkg')

    const doc = {
      ...res.pkg,
      id: pkg_name
    }

    const added = await seneca.post('sys:search,cmd:add', { doc })
      .catch(async (err) => {
        console.error(err.message)

        await seneca.post('sys:search,cmd:remove', {
          id: pkg_name
        })

        return seneca.post('sys:search,cmd:add', { doc })
      })

    if (!added.ok) {
      console.error(added)
      Assert.fail('sys:search,cmd:add')
      return
    }


    return
  }
}

