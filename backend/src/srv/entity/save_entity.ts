module.exports = function make_save_entity() {
  return async function save_entity(this: any, msg: any) {
    const seneca = this

    let data = msg.ent
    let name = msg.name
    let base = msg.base
    let zone = msg.zone

    let ent = seneca.entity(zone, base, name)
    console.log('SAVE-ENT', ent.entity$, ent)

    let res = await ent.data$(data).save$()

    return { ok: !!res, item: res }
  }
}
