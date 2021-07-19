const Seneca = require('seneca')
const Lib = require('../../lib/update')


module.exports = function make_process_change() {
  return function process_change(msg) {
    const seneca = this

    return new Promise(async (resolve, _reject) => {
      try {
        const { change } = msg

        if (null == change) {
          /* NOTE: A null-change is just no change. How do we process no change?
           * That's right - we relax and do nothing at all!
           */

          return resolve({ ok: true })
        }


        if (change.deleted) {
          /* NOTE: A package has been marked as deleted.
           * TODO: Set the package as such in the store.
           */

          return resolve({ ok: true })
        }


        /* NOTE: For more information on why we do this kind of checking,
         * please see:
         *
         * https://github.com/npm/registry/blob/master/docs/follower.md#clean-up
         *
         * - the part on "design docs".
         */
        const is_pkg_change = null != change.doc.name

        if (is_pkg_change) {
          return seneca.make('nodezoo', 'npm')
            .data$(Lib.entdata_of_npm_data(change))
            .save$({ upsert$: ['name'] }, (err) => {
              if (err) {
                seneca.log.error(err.message)

                return resolve({
                  ok: false,
                  why: 'Could not save the changes. Please check the logs.'
                })
              }

              return resolve({ ok: true })
            })
        }


        seneca.log.info("This doesn't look like the kind of change that we" +
          ' currently recognize. I will output the object below for you to' +
          ' inspect:\n')

        seneca.log.info(JSON.stringify(change))


        return resolve({
          ok: false,
          why: 'Unrecognized format of the change.'
        })
      } catch (err) {
        seneca.log.error(err.message)

        return resolve({
          ok: false,
          why: 'Something went wrong. Please check the logs.'
        })
      }
    })
  }
}

