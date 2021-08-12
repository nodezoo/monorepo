
module.exports = function make_is_premium() {
  return async function is_premium(msg) {
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

    try {
      const { items: members } = await seneca.post('list:user,role:group')
      const is_premium = members.some(member => member.id === user_id)

      return { ok: true, data: { is_premium } }
    } catch (err) {
      console.error(err)
      return { ok: false, why: 'internal' }
    }
  }
}

