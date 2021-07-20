const NpmDownload = require('./lib/download')


module.exports = function make_stop_download() {
  return async function stop_download(msg) {
    const seneca = this

    seneca.root.context.npm_download =
      seneca.root.context.npm_download || new NpmDownload(seneca)


    const stopped = seneca.root.context.npm_download.stop()

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
