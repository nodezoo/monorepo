const Moment = require('moment')


class Shared {
  static make_timestamp(date) {
    return Moment(date).format('YYYY-MM-DD')
  }


  static is_valid_timestamp(ts) {
    return 'string' === typeof ts &&
      /^\d{4}-\d{2}-\d{2}$/.test(ts)
  }
}


module.exports = Shared
