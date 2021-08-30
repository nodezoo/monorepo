
module.exports = function make_ping_pong() {
  return async function ping_pong(msg) {
    const seneca = this

    return { ok: true, message: 'payment-pong!' }
  }
}

