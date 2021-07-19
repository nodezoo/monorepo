
module.exports = function make_stop_registry_download() {
  return async function stop_registry_download(msg) {
    const seneca = this

    const { is_downloading } = seneca.root.context
    seneca.root.context.is_downloading = false

    if (is_downloading) {
      return { ok: true, data: { message: 'Stopping the download...' } }
    }

    return {
      ok: true,
      data: {
        message: 'I will succeed, although the download was not in progress.'
      }
    }
  }
}
