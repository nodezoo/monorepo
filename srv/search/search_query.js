
const AWS = require('aws-sdk')

const CSD = new AWS.CloudSearchDomain({
  endpoint: 'search-nodezoo-2j7gf6f5iejssz4rg5t3yzwwja.us-east-1.cloudsearch.amazonaws.com'
});


// file: search_query.js
// Implements role:search,search:query
module.exports = function make_search_query() {
  return async function search_query(msg) {
    let seneca = this
    let query = msg.q

    var params = {
      query: query,
      sort: 'stars desc',
    }

    let res = await new Promise((res,rej) => {
      CSD.search(params, function(err, data) {
        if(err) return rej(err)
        return res(data)
      })
    })

    return {
      ok: true,
      res: res.hits && res.hits.hit,
    }
  }
}
