
module.exports = function make_cmd_start() {
  return async function cmd_start(msg) {
    let seneca = this
    
    return {
      ok: true,
      running: true,
    }
  }
}
