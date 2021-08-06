const Faker = require('faker')


module.exports = function make_create_user() {
  return async function create_user(msg) {
    const seneca = this

    const {
      email = Faker.internet.email(),
      pass = Faker.random.alphaNumeric(8)
    } = msg

    const regmsg = { email, pass }

    await seneca.post('sys:user,register:user', regmsg)

    return {
      ok: true,
      message: 'I sure hope you are in the __development__ environment! ;)',
      data: {
        email,
        pass
      }
    }
  }
}

