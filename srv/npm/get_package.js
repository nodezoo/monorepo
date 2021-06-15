
module.exports = function make_get_package() {
  return async function get_package(msg) {
    var seneca  = this

    let out = {
      ok: true,
    }
    
    out.pkg = await seneca.entity('nodezoo/npm').load$(msg.name)
    out.ok = null != out.pkg
    
    if (!out.pkg || msg.update) {
      let res = await seneca.post(
        'role:source,source:npm,pull:package',
        {name: msg.name}
      )
      
      if(res.ok) {
        out.pkg = res.pkg
        out.ok = null != out.pkg
      }
      else {
        out = res
      }
    }

    return out
  }
}
