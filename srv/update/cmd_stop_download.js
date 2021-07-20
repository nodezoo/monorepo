
module.exports = function make_stop_download() {
  return async function stop_download(msg) {
    const seneca = this

    seneca.root.context.npm_download = seneca.root.context.npm_download ||
      { in_progress: false }

    const { in_progress } = seneca.root.context.npm_download
    seneca.root.context.npm_download.in_progress = false

    if (in_progress) {
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
