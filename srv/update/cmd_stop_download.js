const NpmDownload = require('./lib/download')


module.exports = function make_stop_download() {
  return async function stop_download(msg) {
    const seneca = this

    seneca.root.context.npm_download =
      seneca.root.context.npm_download || new NpmDownload(seneca)


    const stopped = seneca.root.context.npm_download.stop()


    const message = stopped
      ? 'Stopping the download...'
      : 'No download is currently in progress.'

    return { ok: true, data: { message } }
  }
}
