const Assert = require('assert')
const Faker = require('faker')


class Fixtures {
  static bookmark(overrides = {}) {
    return {
      name: Faker.random.alphaNumeric(8),
      owner_id: Faker.random.alphaNumeric(8),
      ...overrides
    }
  }

  static npm(overrides = {}) {
    return {
      name: Faker.random.alphaNumeric(8),
      version: '1.0.0',
      giturl: null,
      desc: Faker.lorem.paragraph(),
      readme: Faker.lorem.paragraph(),
      ...overrides
    }
  }
}


module.exports = Fixtures
