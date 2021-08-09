const Faker = require('faker')


module.exports = function make_create_user() {
  return async function create_user(msg) {
    const seneca = this

    const {
      email = Faker.internet.email(),
      pass = Faker.random.alphaNumeric(8)
    } = msg

    const regmsg = { email, pass }
    const { user } = await seneca.post('sys:user,register:user', regmsg)

    if (null != msg.group_id) {
      const { group_id } = msg
      const { id: user_id } = user

      await seneca.post('add:user,role:group', { user_id, group_id })
    }

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

