const Assert = require('assert')
const { sleep } = require('../../../lib/shared')


class Ingester {
  constructor(seneca, options) {
    this.seneca = seneca
    this.options = options
    this.is_ingesting = false
    this.stats_instance = { start: null, npkgs_lifetime: 0, npkgs_iteration: 0 }
  }

  stats() {
    const {
      start,
      npkgs_lifetime,
      npkgs_iteration
    } = this.stats_instance


    const now = new Date()

    const uptime_ms = null == start
      ? 0
      : now.getTime() - start.getTime()

    const uptime_sec = Math.floor(uptime_ms / 1e3)


    return {
      start,
      npkgs_lifetime,
      npkgs_iteration,
      uptime_sec
    }
  }

  async start(msg) {
    const self = this
    const seneca = this.seneca


    if (self.is_ingesting) {
      return false
    }

    self.is_ingesting = true
    self.stats_instance.start = new Date()


    setImmediate(async () => {
      Assert(null != self.options, 'options')
      Assert(null != self.options.ingester, 'options.ingester')


      const default_sleep_ms_between_iterations = self.options
        .ingester.sleep_ms_between_iterations

      Assert(null != default_sleep_ms_between_iterations,
        'options.sleep_ms_between_iterations')


      const default_sleep_ms_between_fetches = self.options
        .ingester.sleep_ms_between_fetches

      Assert(null != default_sleep_ms_between_fetches,
        'options.sleep_ms_between_fetches')


      const {
        sleep_ms_between_iterations = default_sleep_ms_between_iterations,
        sleep_ms_between_fetches = default_sleep_ms_between_fetches
      } = msg 


      let is_first_iteration = true

      while (self.is_ingesting) {
        self.stats_instance.npkgs_iteration = 0


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

          self.stats_instance.npkgs_lifetime++
          self.stats_instance.npkgs_iteration++

          await sleep(sleep_ms_between_fetches)
        }


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

module.exports = Ingester
