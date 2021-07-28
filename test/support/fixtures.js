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
      giturl: 'https://github.com/senecajs/seneca',
      desc: Faker.lorem.paragraph(),
      readme: Faker.lorem.paragraph(),
      ...overrides
    }
  }

  static github(overrides = {}) {
    return {
      name: Faker.random.alphaNumeric(8),
      owner: Faker.internet.userName(),
      repo: Faker.random.alphaNumeric(16),
      stars: 99,
      forks: 99,
      last: 99,
      ...overrides
    }
  }
}


module.exports = Fixtures
