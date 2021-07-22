const Ingest = require('./lib/ingest')


module.exports = function make_start_ingest() {
  return async function start_ingest(msg) {
    const seneca = this

    seneca.root.context.pkg_ingestion =
      seneca.root.context.pkg_ingestion || new Ingest(seneca)


    const started = await seneca.root.context
      .pkg_ingestion.start(msg)


    const message = started
      ? 'The ingestion loop has been started ok.'
      : 'The ingestion loop is already running.'

    return { ok: true, data: { message } }
  }
}

