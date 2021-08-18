
module.exports = function make_join_premium() {
  return async function join_premium(msg) {
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


    await seneca.post('role:group,add:user', {
      user_id,
      code: 'PremiumUsers'
    })


    return { ok: true }
  }
}

