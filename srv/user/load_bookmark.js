const Auth = require('./lib/auth')
const Shared = require('../../lib/shared')
const { pick } = Shared


module.exports = function make_load_bookmarks() {
  return async function load_bookmarks(msg) {
    const seneca = this


    const auth = await Auth.user(msg, { seneca })

    if (!auth) {
      return { ok: false, why: 'unauthorized' }
    }

    const { user } = auth
    const { id: user_id } = user


    if ('string' !== typeof msg.id) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['id'],
          why_exactly: 'required'
        }
      }
    }

    const { id: bookmark_id } = msg


    const bookmark = await seneca.make('nodezoo', 'bookmark')
      .load$({
        owner_id: user_id,
        id: bookmark_id
      })

    if (!bookmark) {
      return { ok: false, why: 'not-found' }
    }


    const { name: pkg_name } = bookmark


    const npm_pkg = await seneca.make('nodezoo', 'npm')
      .load$({ name: pkg_name })

    if (!npm_pkg) {
      return { ok: false, why: 'not-found' }
    }


    const github_pkg = await seneca.make('nodezoo', 'github')
      .load$({ name: pkg_name })


    return {
      ok: true,

      data: {
        bookmark: ok_bookmark(bookmark),
        npm: ok_npm(npm_pkg),
        github: ok_github(github_pkg) 
      }
    }
  }


  function ok_bookmark(bookmark) {
    return pick(
      bookmark.data$(false),
      ['id', 'owner_id', 'name']
    )
  }


  function ok_npm(npm_pkg) {
    return pick(
      npm_pkg.data$(false),
      ['version', 'giturl', 'desc', 'readme']
    )
  }


  function ok_github(github_pkg) {
    if (!github_pkg) {
      return null
    }

    return pick(
      github_pkg.data$(false),
      ['owner', 'repo', 'stars', 'forks', 'last']
    )
  }
}

