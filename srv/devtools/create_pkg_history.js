const {
  next_day,
  random_int,
  generate_pkg_name,
  make_timestamp
} = require('./lib/shared')


module.exports = function make_create_pkg_history() {
  return async function create_pkg_history(msg) {
    const seneca = this

    const {
      since = '2021-08-01',
      name = generate_pkg_name()
    } = msg


    const now = new Date()

    for (let day = new Date(since); day <= now; day = next_day(day)) {
      seneca.make('nodezoo', 'history')
        .data$({
          name,
          day: make_timestamp(day),
          npm_downloads: random_int(100, 200),
          gh_stars: random_int(10, 50),
          gh_forks: random_int(30, 40),
          gh_issues: random_int(50, 70)
        })
        .save$(err => {
          if (err) console.error(err)
        })
    }


    return { ok: true }
  }
}

