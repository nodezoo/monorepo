
const { Octokit } = require("@octokit/rest")


module.exports = function make_pull_package() {
  const octokit = new Octokit()
  
  return async function pull_package(msg) {
    const seneca = this
    const name = msg.name

    let owner = msg.owner
    let repo = msg.repo

    // role:info,need:part only has name
    if(null == owner) {
      let giturl = await get_giturl(seneca, name)
      if('' == giturl) {
        return {ok:false,why:'no-giturl',name}
      }
    
      let m = /[\/:]([^\/:]+?)[\/:]([^\/]+?)(\.git)*$/.exec(giturl)
      if(!m) {
        return {ok:false,why:'bad-giturl',giturl:giturl,name}
      }

      owner = m[1]
      repo = m[2]
    }
    
    const pkg = await octokit.repos.get({ owner, repo })
          
    out = { ok:true }
    
    let github = seneca.entity('nodezoo/github')
    github = await github.load$(name) || github.data$({id$:name})
      
    const ent = await github.data$({
      name:    msg.name,
      owner:   owner,
      repo:    repo,
      stars:   pkg.data.stargazers_count,
      watches: pkg.data.subscribers_count,
      forks:   pkg.data.forks_count,
      last:    pkg.data.pushed_at
    }).save$()

    out.pkg = ent

    return out
  }


  async function get_giturl(seneca,name) {
    let npment = await seneca.entity('nodezoo/npm').load$(name)

    // Might be new, wait for npm pull
    if(null == npment) {
      await new Promise((r)=>setTimeout(r,555))
      npment = await seneca.entity('nodezoo/npm').load$(name)
    }

    return npment && npment.giturl || ''
  }
}
