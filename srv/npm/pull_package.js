const Assert = require('assert')
const Axios = require('axios')


module.exports = function make_pull_package(options_wrapper) {
  Assert(null != options_wrapper.options, 'options_wrapper.options')
  const { options } = options_wrapper


  return async function pull_package(msg) {
    const seneca = this


    const { name = null } = msg

    if (null == name) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['name'],
          why_exactly: 'required'
        }
      }
    }


    Assert(null != options.npm_registry_url,
      'options.npm_registry_url')

    const pkgurl = options.npm_registry_url + '/' + encodeURIComponent(name)


    const response = await Axios.get(pkgurl, {
      validateStatus(status) {
        // NOTE: Preventing crashes on non-HTTP 500 responses.
        //
        return status < 500
      }
    })

    const out = { ok: false }


    if (200 === response.status) {
      const pkg = response.data

      const dist_tags  = pkg['dist-tags'] || {}
      const latest     = ((pkg.versions||{})[dist_tags.latest]) || {}
      const repository = latest.repository || {}

      let npm = seneca.entity('nodezoo/npm')
      npm = await npm.load$(name) || npm.data$({id$:name})
      
      const ent = await npm.data$({
        name:    name,
        version: dist_tags.latest,
        giturl:  repository.url,
        desc:    pkg.description || '',
        readme:  pkg.readme || ''
      }).save$({
        upsert$: ['name']
      })

      out.ok = true
      out.pkg = ent.data$(false)
      delete out.pkg.readme
    }
    
    return out
  }
}
