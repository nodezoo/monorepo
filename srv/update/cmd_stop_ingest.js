const Ingest = require('./lib/ingest')


module.exports = function make_stop_ingest() {
  return async function stop_ingest(msg) {
    const seneca = this

    seneca.root.context.pkg_ingestion =
      seneca.root.context.pkg_ingestion || new Ingest(seneca)

    const stopped = seneca.root.context.pkg_ingestion.stop()


    const message = stopped
      ? 'Stopping the ingestion loop...'
      : 'The ingestion loop was not running.'

    return { ok: true, data: { message } }
  }
}

