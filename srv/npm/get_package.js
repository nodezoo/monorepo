
module.exports = function make_get_package() {
  return async function get_package(msg) {
    var seneca  = this


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


    let out = {
      ok: true,
    }
    
    out.pkg = await seneca.entity('nodezoo/npm')
      .load$(msg.name)
      .then(ent => ent ? ent.data$(false) : null)

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

    // if(out.pkg) {
    //   delete out.pkg.readme
    // }
    
    return out
  }
}
