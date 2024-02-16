module.exports = function make_web_load_entity() {
  return async function web_load_entity(this: any, msg: any) {
    const seneca = this

    // TODO: review
    let entmsg = {
      aim: 'entity',
      load: 'entity',
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
      out.item = res.item
    }

    return out
  }
}
