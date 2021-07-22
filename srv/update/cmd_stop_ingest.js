
module.exports = function make_stop_ingest() {
  return async function stop_ingest(msg) {
    const seneca = this

    seneca.root.context.is_ingesting = false

    return { ok: true }
  }
}

