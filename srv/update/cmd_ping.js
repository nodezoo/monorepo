
module.exports = function make_cmd_ping() {
  return async function cmd_ping(msg) {
    return {
      ok: true,
      data: {
        message: 'pong!'
      }
    }
  }
}

