const Shared = require('../../lib/shared')
const { pick } = Shared


module.exports = function make_submit_checkout() {
  return async function submit_checkout(msg) {
    console.dir(msg) // dbg

    return { ok: true }
  }
}

