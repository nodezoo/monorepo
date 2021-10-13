
const Assert = require('assert')
const Shared = require('../../lib/shared')
const { pick } = Shared


module.exports = npm



function npm(options) {
  const seneca = this
  const reload = this.export('reload/make')(require)

  Shared.messages(seneca, options, reload, require)


  // NOTE: This overrides Entity#save$ on nodezoo/npm entities.
  //
  seneca.add(
    'role:entity,cmd:save,base:nodezoo,name:npm',

    function (msg, reply) {
      return this.prior(msg, function (err, saved) {
        if (err) {
          return reply(err)
        }

        // NOTE: Because the package may already be in the search pool,
        // we should then overwrite it in the search pool.
        //
        // sys:search,cmd:remove is required by its contract to not crash,
        // hence it should be perfectly fine to try to remove a document
        // from the search pool that does not exist.

        const { ent: mement } = msg
        Assert(mement, 'msg.ent')

        const { name: pkg_name } = mement
        Assert.strictEqual(typeof pkg_name, 'string', 'msg.ent.name')

        const doc = {
          id: pkg_name,

          name: pkg_name,

          ...pick(mement, [
            'name',
            'version',
            'giturl',
            'desc',
            'readme'
          ])
        }

        return seneca.act(
          'sys:search,cmd:add',

          { doc },

          function (err, added) {
            const added_ok = (!err) && (null == added || added.ok)

            if (added_ok) {
              return reply(null, saved)
            }


            return seneca.act(
              'sys:search,cmd:remove',

              { id: pkg_name },

              function (_err) {
                return seneca.act(
                  'sys:search,cmd:add',

                  { doc },

                  function (err) {
                    if (err) {
                      // NOTE: If we have failed to upsert the document to
                      // the search plugin, we must report the error.
                      //
                      return reply(err)
                    }

                    return reply(null, saved)
                  })
              })
          })
      })
    })
}

