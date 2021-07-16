
module.exports = function make_cmd_stop() {
  return async function cmd_stop(msg) {
    let seneca = this
    
    return {
      ok: true,
      running: false,
    }
  }
}
