
module.exports = function make_cmd_start_download() {
  return async function cmd_start_download(msg) {
    let seneca = this
    
    return {
      ok: true,
      running: true,
    }
  }
}
