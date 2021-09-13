
const AWS = require('aws-sdk')

const CSD = new AWS.CloudSearchDomain({
  endpoint: 'doc-nodezoo-2j7gf6f5iejssz4rg5t3yzwwja.us-east-1.cloudsearch.amazonaws.com'
});


module.exports = function make_collect_part() {
  return async function collect_part(msg) {
    let seneca = this
    let name = msg.name

    let start = Date.now()
    console.log('BEGIN', name, start)

    
    let cache = (seneca.root.context.cache = seneca.root.context.cache || {})

    let info = (cache[name] = cache[name] || {})

    info[msg.part] = msg.data

    let submit = true
    let parts = ['npm','github']
    for(part of parts) {
      submit = submit && !!info[part]
    }

    console.log('SUBMIT', name, submit, Object.keys(info))
    
    if(submit) {
      var params = {
        contentType: 'application/json',
        documents: JSON.stringify([{
          id: name,
          type: 'add',
          fields: seneca.util.clean({
            ...info.npm,
            ...info.github,
          })
        }])
      }

      console.log('PARAMS', params)
      
      CSD.uploadDocuments(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      })

      let end = Date.now()
      console.log('END', name, end, end-start)

    }
  }
}
