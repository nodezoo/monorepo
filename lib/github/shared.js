const Assert = require('assert')


const shared = {
  owner_and_repo_from_giturl(giturl) {
    Assert.strictEqual(typeof giturl, 'string', 'giturl')


    const m = /[\/:]([^\/:]+?)[\/:]([^\/]+?)(\.git)*$/.exec(giturl)

    if (!m) {
      return null
    }


    const owner = m[1]
    const repo = m[2]

    if (!owner || !repo) {
      return null
    }


    return { owner, repo }
  }
}


module.exports = shared
