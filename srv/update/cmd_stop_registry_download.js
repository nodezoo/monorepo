
module.exports = function make_stop_registry_download() {
  return async function stop_registry_download(msg) {
    const seneca = this

    seneca.context.is_downloading = false

    return { ok: true }
  }
}
