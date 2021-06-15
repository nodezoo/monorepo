
module.exports = function make_collect_part() {
  return async function collect_part(msg) {
    let seneca = this
    let name = msg.name

    let cache = (seneca.root.context.cache = seneca.root.context.cache || {})

    let info = (cache[name] = cache[name] || {})

    info[msg.part] = msg.data
  }
}
