module.exports = function make_list_entity() {
  return async function list_entity(this: any, msg: any) {
    const seneca = this
    const { clean } = seneca.util

    let q = clean(msg.q)
    let name = msg.name
    let base = msg.base
    let zone = msg.zone

    const ent = seneca.entity(zone, base, name)
    console.log('LIST-Q', ent.entity$, q)

    let list = await ent.list$(q)

    return { ok: !!list, list, q }
  }
}
