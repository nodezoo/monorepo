

module.exports = function make_need_part() {
  return async function need_part(msg) {
    let seneca = this
    let name = msg.name
    
    let res = await seneca.post(
      'role:source,source:github,get:package',
      {name:msg.name}
    )

    if(res.ok) {
      await seneca.post('role:info,collect:part', {
        name,
        part: 'github',
        data: res.pkg
      })
    }
  }
}
