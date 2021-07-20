const NpmDownload = require('./lib/download')


module.exports = function make_stop_download() {
  return async function stop_download(msg) {
    const seneca = this
    const stopped = NpmDownload.terminate()

    if (stopped) {
      return {
        ok: true,
        data: { message: 'Stopping the download...' }
      }
    }

    return {
      ok: true,
      data: { message: 'No download is currently in progress.' }
    }
  }
}
