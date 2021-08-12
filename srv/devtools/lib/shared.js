const Faker = require('faker')
const Moment = require('moment')


class Shared {
  static next_day(dt) {
    return new Date(dt.getTime() + 24 * 60 * 60 * 1e3)
  }


  static random_int(start, until) {
    return Math.floor(start + (until - start) * Math.random())
  }


  static generate_pkg_name() {
    return [Faker.lorem.word(), Faker.random.alphaNumeric(2)].join('_')
  }


  static make_timestamp(date) {
    return Moment(date).format('YYYY-MM-DD')
  }
}


module.exports = Shared
