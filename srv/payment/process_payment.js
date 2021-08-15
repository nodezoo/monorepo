
module.exports = function make_process_payment() {
  return async function process_payment(msg) {
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


    // TODO: Stripe integration.
    //


    return { ok: true }
  }
}
