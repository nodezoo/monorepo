const Moment = require('moment')


class Shared = {
  static make_timestamp(date) {
    return Moment(date).format('YYYY-MM-DD')
  }
}


module.exports = Shared
