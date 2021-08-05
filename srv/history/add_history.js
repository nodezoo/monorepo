const Assert = require('assert')


module.exports = function make_add_history() {
  return async function add_history(msg) {
    const seneca = this

    return { ok: false, why: 'not-impl' }
  }
}

