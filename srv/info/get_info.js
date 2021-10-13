
module.exports = function make_get_info() {
  return async function get_info(msg) {
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

    const cache = (seneca.root.context.cache = seneca.root.context.cache || {})

    const info = cache[name]

    const pending = null == info ||
      null == info.npm ||
      null == info.github ||
      false
    
    if (pending) {
      seneca.act('role:info,need:part', { name })
    }
    
    return {
      ok: true,
      pending,
      name,
      info
    }
  }
}
