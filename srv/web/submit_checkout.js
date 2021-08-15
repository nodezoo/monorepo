const Shared = require('../../lib/shared')
const { pick } = Shared


module.exports = function make_submit_checkout() {
  return async function submit_checkout(msg) {
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

    const payment_res = await seneca
      .post('role:payment,process:payment', { user_id })

    if (!payment_res.ok) {
      return { ok: false, why: 'checkout-failed' }
    }


    const premium_res = await seneca
      .post('role:user,join:premium', { user_id })

    if (!premium_res.ok) {
      return { ok: false, why: 'checkout-failed' }
    }


    return { ok: true }
  }
}

