module.exports = function make_load_entity() {
  return async function load_entity(this: any, msg: any) {
    const seneca = this
    const { clean } = seneca.util

    let q = clean(msg.q)
    let name = msg.name
    let base = msg.base
    let zone = msg.zone

    let ent = seneca.entity(zone, base, name)
    console.log('LOAD-Q', ent.entity$, q)

    let item = await ent.load$(q)

    return { ok: !!item, item, q }
  }
}
  `
