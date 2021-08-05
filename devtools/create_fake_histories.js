const Faker = require('faker')


async function run(args) {
  const { seneca } = args
  const { num_pkgs = 1, since = '2021-08-01' } = args

  for (let times = 0; times < num_pkgs; times++) {
    const pkg_name = [Faker.lorem.word(), Faker.random.alphaNumeric(2)].join('_')

    const now = new Date()

    for (let day = new Date(since); day <= now; day = nextDay(day)) {
      seneca.make('nodezoo', 'history')
        .data$({
          name: pkg_name,
          day,
          npm_downloads: randomInt(100, 200),
          gh_stars: randomInt(10, 50),
          gh_forks: randomInt(30, 40),
          gh_issues: randomInt(50, 70)
        })
        .save$(err => {
          if (err) console.error(err)
        })
    }
  }
}


const nextDay = dt => new Date(dt.getTime() + 24 * 60 * 60 * 1e3)


const randomInt = (start, until) =>
  Math.floor(start + (until - start) * Math.random())


module.exports = { run }
