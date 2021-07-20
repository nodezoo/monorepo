
const Axios = require('axios')


module.exports = function make_pull_package({ options }) {
  return async function pull_package(msg) {
    const seneca = this

    const { name } = msg
    const pkgurl = options.registry + encodeURIComponent(name)

    const response = await Axios.get(pkgurl)
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
      }).save$()

      out.ok = true
      out.pkg = ent
      delete out.pkg.readme
    }
    
    return out
  }
}
