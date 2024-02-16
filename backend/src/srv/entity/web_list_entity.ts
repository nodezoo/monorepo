module.exports = function make_web_list_entity() {
  return async function web_list_entity(this: any, msg: any) {
    const seneca = this

    // TODO: review
    let entmsg = {
      aim: 'entity',
      list: 'entity',
      ent: msg.ent,
      q: msg.q,
      name: msg.name,
      base: msg.base,
      zone: msg.zone,
    }

    let res = await seneca.post(entmsg)

    let out: any = {
      ok: res.ok,
    }

    if (res.ok) {
      out.list = res.list
    }

    return out
  }
}
