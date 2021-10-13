const Assert = require('assert')
const Shared = require('../../lib/shared')
const { pick, sleep } = Shared


module.exports = function make_show_pkg() {
  return async function show_pkg(msg) {
    const seneca = this


    const { name: pkg_name = null } = msg

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


    let res

    for (let i = 0; i < 3; i++) {
      res = await seneca.post('role:info,get:info', {
        name: pkg_name
      })

      if (!res.ok) {
        console.error(res)
        continue
      }
      
      if (res.pending) {
        const wait_ms = Math.pow(2, i)
        await sleep(wait_ms)
        continue
      }

      break
    }


    Assert(res, 'res')


    if (!res.ok) {
      return { ok: false }
    }

    if (res.pending && !(null != res.info && null != res.info.npm)) {
      // NOTE: If the response is still pending and the info is
      // unavailable - after all the attempts, - we assume that
      // the package does not exist.
      //
      return { ok: false, why: 'not-found' }
    }


    const {
      npm: npm_data,
      github: gh_data = null
    } = res.info

    const npm_out = pick(npm_data, [
      'name', 'version', 'giturl', 'desc', 'readme'
    ])

    const gh_out = null == gh_data
      ? null
      : pick(gh_data, [
          'owner', 'repo', 'stars', 'forks', 'last'
        ])


    return {
      ok: true,
      data: {
        pkg: {
          name: pkg_name,
          npm: npm_out,
          github: gh_out
        }
      }
    }
  }
}

