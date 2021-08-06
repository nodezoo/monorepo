const Faker = require('faker')
const { generate_pkg_name } = require('./lib/shared')


module.exports = function make_create_npm_pkg() {
  return async function create_npm_pkg(msg) {
    const seneca = this

    const {
      name = generate_pkg_name(),
      giturl = null
    } = msg

    seneca.make('nodezoo', 'npm')
      .data$({
        name,
        version: '0.0.0',
        giturl,
        desc: Faker.lorem.sentence(),
        readme: Faker.lorem.sentence()
      })
      .save$((err, out) => {
        if (err) {
          return { ok: false, details: { message: err.message } }
        }

        return { ok: true, data: { ent: out } }
      })

    return
  }
}

