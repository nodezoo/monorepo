const { sleep } = require('../../../lib/shared')


class Ingest {
  constructor(seneca) {
    this.seneca = seneca
    this.is_ingesting = false
  }

  async start(msg) {
    const self = this
    const seneca = this.seneca


    if (self.is_ingesting) {
      return false
    }

    self.is_ingesting = true


    setImmediate(async () => {
      const {
        sleep_ms_between_iterations = 5e3,
        sleep_ms_between_fetches = 1e3
      } = msg

      const stats = { total_ingested: 0 }


      let is_first_iteration = true

      while (self.is_ingesting) {
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


        const pkgs = await seneca.make('nodezoo', 'orig')
          .list$(pkgs_q)

        seneca.log.info(`Preparing to ingest ${pkgs.length} packages.`)


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
          await sleep(sleep_ms_between_fetches)
        }


        stats.total_ingested += pkgs.length

        seneca.log.info('Total ingested packages so far: ' +
          stats.total_ingested)


        await sleep(sleep_ms_between_iterations)
      }
    })

    return true
  }


  stop() {
    if (!this.is_ingesting) {
      return false
    }

    this.is_ingesting = false

    return true
  }
}

module.exports = Ingest
