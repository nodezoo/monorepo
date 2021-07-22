const { sleep } = require('../../lib/shared')


module.exports = function make_start_ingest() {
  return async function start_ingest(msg) {
    const seneca = this

    const started = run(seneca, msg)

    const message = started
      ? 'The ingestion loop has been started ok.'
      : 'The ingestion loop is already running.'


    return { ok: true, data: { message } }
  }
}


function run(seneca, msg) {
  const { is_ingesting } = seneca.root.context

  if (is_ingesting) {
    return false
  }

  seneca.root.context.is_ingesting = true


  let is_first_iteration = true

  setImmediate(async () => {
    while (seneca.root.context.is_ingesting) {
      const pkgs_q = { fields$: ['name'] }

      if (msg.resume || !is_first_iteration) {
        /* NOTE: If the client wants to resume the ingestion action, then
         * we only want to care for packages that have not been ingested.
         *
         * On the successive iterations of the ingestion loop, we always care
         * solely for packages that have not been ingested.
         */

        pkgs_q.ingested_at = null
      }

      is_first_iteration = false


      // TODO: convert into a singleton object
      // TODO: print counters on every iteration
      //
      const pkgs = await seneca.make('nodezoo', 'orig')
        .list$(pkgs_q)


      /* NOTE: An astute reader would notice that in case of error, some
       * packages will not be ingested, yet still be marked as ingested.
       * For now, that's okay.
       */
      const marking = pkgs.map(pkg => 
        pkg
          .data$({
            ingested_at: new Date().toISOString()
          })
          .save$()
      )

      await Promise.all(marking)


      for (const pkg of pkgs) {
        seneca.act('role:info,need:part', { name: pkg.name })
        await sleep(1e3) // TODO: Make tweakable via args.
      }


      await sleep(1e3) // TODO: Make tweakable via args.
    }
  })

  return true
}

