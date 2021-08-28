
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


    /* do not await */ seneca.post('role:info,collect:part', {
      name: pkg_name,
      part: 'npm',
      data: npm_res.pkg
    })


    const gh_res = await seneca.post(
      'role:source,source:github,get:package',

      /* QUESTION: Pass the giturl instead of the package name here?
       */
      { name: pkg_name }
    )

    if (!gh_res.ok) {
      return { ok: false }
    }


    /* do not await */ seneca.post('role:info,collect:part', {
      name: pkg_name,
      part: 'github',
      data: gh_res.pkg
    })


    // TODO: The package may already be in the search pool.
    // In that case we must delete it and add again.

    /* do not await */ seneca.post('sys:search,cmd:add', {
      doc: { ...gh_res.pkg, ...npm_res.pkg }
    })


    return { ok: true }
  }
}

