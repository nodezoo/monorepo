module.exports = function make_web_save_entity() {
  return async function web_save_entity(this: any, msg: any) {
    const seneca = this

    // TODO: review
    let entmsg = {
      aim: 'entity',
      save: 'entity',
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
