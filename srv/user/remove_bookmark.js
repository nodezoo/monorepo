
module.exports = function make_remove_bookmark() {
  return async function remove_bookmark(msg) {
    const seneca = this


    const { user_id } = msg

    if (null == user_id) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['user_id'],
          why_exactly: 'required'
        }
      }
    }


    const { name: pkg_name } = msg

    if ('string' !== typeof pkg_name) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['name'],
          why_exactly: 'required'
        }
      }
    }


    await seneca.make('nodezoo', 'bookmark')
      .remove$({ name: pkg_name, owner_id: user_id })


    return { ok: true }
  }
}

