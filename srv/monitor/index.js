const Seneca = require('seneca')

let seneca = Seneca({legacy:false})
    .use('promisify')
    .message('role:monitor,get:status', async function get_status(msg) {
      return {ok:true, x:msg.x}
    })

exports.handler = async (event) => {
  console.log(event)
  let out = await seneca.post('role:monitor,get:status', {x:event.x})
  
  const response = {
    statusCode: 200,
    body: JSON.stringify(out),
  }

  return response
}
