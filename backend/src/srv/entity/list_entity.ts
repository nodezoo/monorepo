module.exports = function make_list_entity() {
  return async function list_entity(this: any, msg: any) {
    const seneca = this

    // TODO: review
    // let canon = msg.canon
    // let ent = msg.ent
    let q = msg.q
    let name = msg.name
    let base = msg.base
    let zone = msg.zone

    let list = await seneca.entity(zone, base, name).list$(q)

    return { ok: !!list, list, q }
  }
}
