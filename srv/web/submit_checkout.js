const Shared = require('../../lib/shared')
const { pick } = Shared


module.exports = function make_submit_checkout() {
  return async function submit_checkout(msg) {
    const seneca = this

    console.dir(msg) // dbg

    const payment_res = await seneca
      .post('role:payment,process:payment')

    if (!payment_res.ok) {
      return { ok: false, why: 'checkout-failed' }
    }

    return { ok: true }
  }
}

