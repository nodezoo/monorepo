
module.exports = function make_get_info() {
  return async function get_info(msg) {
    let seneca = this
    let name = msg.name

    let cache = (seneca.root.context.cache = seneca.root.context.cache || {})

    let info = cache[name]
    let pending = null == info || null == info.npm || null == info.github || false
    
    if(pending) {
      seneca.act('role:info,need:part', {name})
    }
    
    return {
      ok: true,
      pending,
      name,
      info
    }
  }
}
