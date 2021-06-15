

module.exports = function make_need_part() {
  return async function need_part(msg) {
    let seneca = this
    let name = msg.name

    let start = Date.now()
    console.log('BEGIN', name, start)
    
    let res = await seneca.post(
      'role:source,source:npm,get:package',
      {name:msg.name}
    )

    if(res.ok) {
      await seneca.post('role:info,collect:part', {
        name,
        part: 'npm',
        data: res.pkg
      })
    }

    let end = Date.now()
    console.log('END', name, end, end-start)
  }
}
