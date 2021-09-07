const Assert = require('assert')


module.exports = function make_need_part() {
  return async function need_part(msg) {
    const seneca = this
    const { name: pkg_name } = msg

    if (null == pkg_name) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['name'],
          why_exactly: 'required'
        }
      }
    }


    const npm_res = await seneca.post(
      'role:source,source:npm,get:package',
      { name: pkg_name }
    )

    if (!npm_res.ok) {
      return { ok: false }
    }


    const gh_res = await seneca.post(
      'role:source,source:github,get:package',

      /* QUESTION: Pass the giturl instead of the package name here?
       */
      { name: pkg_name }
    )

    if (!gh_res.ok) {
      /* NOTE: Whatever - if we are here, then the package has no giturl.
       * In that case we may simply continue
       *
       * TODO: Be more explicit with regard to error codes.
       */
    }


    // NOTE: Because the package may already be in the search pool,
    // we should then overwrite it in the search pool.
    //
    // sys:search,cmd:remove is required to not crash by its
    // contract, so it should be perfectly fine to try to
    // remove a document from the search pool that does not
    // exist.

    Assert(null != npm_res.pkg, 'npm_res.pkg')

    const doc = {
      ...(gh_res.pkg || {}),
      ...npm_res.pkg,
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


    return { ok: added.ok }
  }
}

