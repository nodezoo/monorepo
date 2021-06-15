
const AWS = require('aws-sdk')

const CSD = new AWS.CloudSearchDomain({
  endpoint: 'search-nodezoo-2j7gf6f5iejssz4rg5t3yzwwja.us-east-1.cloudsearch.amazonaws.com'
});


module.exports = function make_search_query() {
  return async function search_query(msg) {
    let seneca = this
    let query = msg.q

    var params = {
      query: query,
      sort: 'stars desc',
    }

    console.log('QUERY', params)
    
    let res = await new Promise((res,rej) => {
      CSD.search(params, function(err, data) {
        if(err) return rej(err)
        return res(data)
      })
    })

    console.log('RES', res)

    return {
      ok: true,
      res: res.hits && res.hits.hit,
    }
  }
}
