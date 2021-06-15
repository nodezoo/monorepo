
var Wreck = require('@hapi/wreck')


module.exports = function make_pull_package({options}) {
  return async function pull_package(msg) {
    const seneca = this
    const name = msg.name
    
    const pkgurl = options.registry + name
    const { res, payload } = await Wreck.get(pkgurl)

    out = { ok:false }
    
    if( 200 === res.statusCode) {
      var pkg = JSON.parse(payload.toString())

      var dist_tags  = pkg['dist-tags'] || {}
      var latest     = ((pkg.versions||{})[dist_tags.latest]) || {}
      var repository = latest.repository || {}

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
